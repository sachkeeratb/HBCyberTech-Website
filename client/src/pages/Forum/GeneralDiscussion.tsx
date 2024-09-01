import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Box,
	Heading,
	Text,
	VStack,
	useColorModeValue,
	Flex,
	Button,
	SlideFade,
	Input,
	Select
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ForumPost {
	id: string;
	author: string;
	email: string;
	date: string;
	time: string;
	title: string;
	body: string;
}

const DesktopForumPost: React.FC<ForumPost> = ({
	id,
	author,
	email,
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
					<SlideFade in={true} offsetY='50vh'>
						<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
							<Link to={'/forum/general/' + id}>
								<Text
									fontSize='xl'
									fontWeight='bold'
									mr={2}
									align='left'
									overflow='hidden'
								>
									{title}
								</Text>
							</Link>
						</motion.div>
					</SlideFade>
					<Text
						fontSize='md'
						color='gray.400'
						mt={1}
						align='left'
						overflow='hidden'
					>
						by {author} &lt;{email}&gt;
					</Text>
				</Flex>
				<Text fontSize='sm' color='gray.400' align='right' overflow='hidden'>
					{date} at {time}
				</Text>
			</Flex>
			<Flex mt={4}>
				<Text fontSize='md' align='left' overflow='hidden'>
					{body}
				</Text>
			</Flex>
		</Box>
	);
};

const MobileForumPost: React.FC<ForumPost> = ({
	id,
	author,
	email,
	date,
	time,
	title,
	body
}) => {
	const BG = useColorModeValue('white', 'gray.800');
	return (
		<Box bg={BG} p={5} borderRadius='md' minWidth={'100%'}>
			<Flex direction='column' align='left'>
				<SlideFade in={true} offsetY='50vh'>
					<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
						<Link to={'/forum/general/' + id}>
							<Text
								fontSize='xl'
								fontWeight='bold'
								mr={2}
								align='left'
								overflow='hidden'
							>
								{title}
							</Text>
						</Link>
					</motion.div>
				</SlideFade>
			</Flex>

			<Text fontSize='md' color='gray.400' align='left' overflow='hidden'>
				by {author} &lt;{email}&gt;
			</Text>
			<Text fontSize='sm' color='gray.400' align='left' overflow='hidden'>
				{date} at {time}
			</Text>
			<Flex mt={4}>
				<Text fontSize='md' align='left' overflow='hidden'>
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
	const [isMobile, setIsMobile] = useState(
		typeof window !== 'undefined' && window.innerWidth < 1024
	);

	useEffect(() => {
		function handleResize() {
			setIsMobile(window.innerWidth < 1024);
		}

		if (typeof window !== 'undefined') handleResize();

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [isMobile]);

	const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState('title');

	useEffect(() => {
		fetchForumPosts();
	}, [page, search, filter]);

	const fetchForumPosts = async () => {
		try {
			const response = await instance.post('/forum/general/get', {
				page: page,
				limit: 10,
				search: search,
				field: filter
			});
			const postArr: ForumPost[] = [];
			for (let i = 0; i < response.data.length; i++) {
				const currItem = JSON.parse(JSON.stringify(response.data[i]));
				const ymd = currItem.date_created.substring(0, 10) + 'T';
				let hms =
					currItem.date_created.substring(
						11,
						currItem.date_created.indexOf('.')
					) + '.000Z';
				if (hms.length != 13) {
					hms = '0' + hms;
				}
				const givenDate = new Date(ymd + hms);
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
				const id = currItem.id;
				const author = currItem.author;
				const email = currItem.email;
				const title = currItem.title;
				const body = currItem.body;
				postArr.push({ id, author, email, date, time, title, body });
			}
			setHasMore(postArr.length === 10);
			setForumPosts(postArr);
		} catch (error) {
			console.error('Error fetching announcements:', error);
		}
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
		setPage(1);
		setForumPosts([]);
		setHasMore(true);
	};

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
				<Box>
					<Flex justifyContent='space-between'>
						<Input
							placeholder='Search posts...'
							value={search}
							onChange={handleSearchChange}
							mb={4}
							maxWidth={'74%'}
						/>
						<Select
							maxWidth='25%'
							onChange={(e) => setFilter(e.target.value)}
							defaultValue='title'
						>
							<option value='title'>Title</option>
							<option value='author'>Author</option>
							<option value='email'>Email</option>
						</Select>
					</Flex>
				</Box>
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
										id={forumPost.id}
										author={forumPost.author}
										email={forumPost.email}
										date={forumPost.date}
										time={forumPost.time}
										title={forumPost.title}
										body={forumPost.body}
									/>
								) : (
									<DesktopForumPost
										id={forumPost.id}
										author={forumPost.author}
										email={forumPost.email}
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
				<Box mt={4} display='flex' justifyContent='space-between'>
					<Button
						onClick={() => setPage((page) => Math.max(page - 1, 1))}
						disabled={page === 1}
					>
						Previous
					</Button>
					<Text pt={'1vh'}>Page {page}</Text>
					<Button
						onClick={() => {
							if (hasMore) setPage((page) => page + 1);
						}}
					>
						Next
					</Button>
				</Box>
			</div>
		</Box>
	);
}
