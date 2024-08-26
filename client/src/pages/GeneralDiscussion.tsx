import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import axios from 'axios';
import {
	Box,
	Heading,
	Text,
	VStack,
	useColorModeValue,
	Flex,
	Button
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface ForumPostRequest {
	author: string;
	date_created: string;
	title: string;
	body: string;
}

interface ForumPost {
	author: string;
	date: string;
	time: string;
	title: string;
	body: string;
}

const DesktopForumPost: React.FC<ForumPost> = ({
	author,
	date,
	time,
	title,
	body
}) => {
	const BG = useColorModeValue('white', 'gray.800');
	return (
		<Box bg={BG} p={5} borderRadius='md' minWidth={'100%'}>
			<Flex justify='space-between' align='center'>
				<Flex>
					<Text fontSize='xl' fontWeight='bold' mr={2} align='left'>
						{title}
					</Text>
					<Text fontSize='md' color='gray.400' mt={1} align='left'>
						by {author}
					</Text>
				</Flex>
				<Text fontSize='sm' color='gray.400' align='right'>
					{date} at {time}
				</Text>
			</Flex>
			<Flex mt={4}>
				<Text fontSize='md' align='left'>
					{body}
				</Text>
			</Flex>
		</Box>
	);
};

const MobileForumPost: React.FC<ForumPost> = ({
	author,
	date,
	time,
	title,
	body
}) => {
	const BG = useColorModeValue('white', 'gray.800');
	return (
		<Box bg={BG} p={5} borderRadius='md' minWidth={'100%'}>
			<Flex direction='column' align='left'>
				<Text fontSize='xl' fontWeight='bold' mr={2} align='left'>
					{title}
				</Text>
				<Text fontSize='md' color='gray.400' align='left'>
					by {author}
				</Text>
			</Flex>
			<Text fontSize='sm' color='gray.400' align='left'>
				{date} at {time}
			</Text>
			<Flex mt={4}>
				<Text fontSize='md' align='left'>
					{body}
				</Text>
			</Flex>
		</Box>
	);
};

const instance = axios.create({
	baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
	timeout: 1000,
	withCredentials: false,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': '*',
		'Access-Control-Allow-Headers': '*',
		'Content-Type': 'application/json'
	}
});

export default function General() {
	const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);

	useEffect(() => {
		(async function fetchForumPosts() {
			try {
				const response = await instance.get('/forum/general/get');
				const responseArr: ForumPostRequest[] = [];
				const postArr: ForumPost[] = [];
				for (let i = 0; i < response.data.length; i++) {
					responseArr.push(JSON.parse(JSON.stringify(response.data[i])));
					const ymd = responseArr[i].date_created.substring(0, 10) + 'T';
					let hms =
						responseArr[i].date_created.substring(
							11,
							responseArr[i].date_created.indexOf('.')
						) + '.000Z';
					if (hms.length != 13) {
						hms = '0' + hms;
					}
					const givenDate = new Date(ymd + hms);
					const author = responseArr[i].author;
					const date = givenDate.toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					});
					const time = givenDate.toLocaleString('en-US', {
						hour: 'numeric',
						minute: 'numeric',
						hour12: true
					});
					const title = responseArr[i].title;
					const body = responseArr[i].body;
					postArr.push({ author, date, time, title, body });
				}
				setForumPosts(postArr);
			} catch (error) {
				console.error('Error fetching announcements:', error);
			}
		})();
	}, []);
	const BG = useColorModeValue('gray.700', 'purple.700');

	return (
		<Box>
			<Heading as='h1' size='xl' mt={4}>
				General Discussion
				<Flex justify='right' mb={4}>
					<Link to='/forum/create'>
						<Button colorScheme='purple'>Create New Post</Button>
					</Link>
				</Flex>
			</Heading>
			<div>
				<div>
					<VStack
						spacing={2}
						w='100%'
						bg={BG}
						rounded='lg'
						boxShadow='lg'
						p={{ base: 1, sm: 1 }}
					>
						{forumPosts.map((forumPost, key) => (
							<VStack spacing={4} w='100%' key={key}>
								{isMobile ? (
									<MobileForumPost
										author={forumPost.author}
										date={forumPost.date}
										time={forumPost.time}
										title={forumPost.title}
										body={forumPost.body}
									/>
								) : (
									<DesktopForumPost
										author={forumPost.author}
										date={forumPost.date}
										time={forumPost.time}
										title={forumPost.title}
										body={forumPost.body}
									/>
								)}
							</VStack>
						))}
					</VStack>
				</div>
			</div>
		</Box>
	);
}
