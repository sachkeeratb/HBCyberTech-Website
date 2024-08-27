import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Box,
	Heading,
	Text,
	VStack,
	Button,
	FormControl,
	FormLabel,
	Textarea,
	useColorModeValue,
	Flex,
	SlideFade
} from '@chakra-ui/react';
import axios from 'axios';
import { motion } from 'framer-motion';

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

interface Comment {
	author: string;
	body: string;
	date: string;
	time: string;
}

interface ForumPost {
	author: string;
	email: string;
	date: string;
	time: string;
	title: string;
	body: string;
}

const DesktopForumPost: React.FC<ForumPost> = ({
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
							<Text fontSize='xl' fontWeight='bold' mr={2} align='left'>
								{title}
							</Text>
						</motion.div>
					</SlideFade>
					<Text fontSize='md' color='gray.400' mt={1} align='left'>
						by {author} &lt;{email}&gt;
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
						<Text fontSize='xl' fontWeight='bold' mr={2} align='left'>
							{title}
						</Text>
					</motion.div>
				</SlideFade>
			</Flex>

			<Text fontSize='md' color='gray.400' align='left'>
				by {author} &lt;{email}&gt;
			</Text>
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

export default function Post() {
	const navigate = useNavigate();

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

	const { id } = useParams<{ id: string }>();
	const [post, setPost] = useState<ForumPost | null>(null);
	const [comments, setComments] = useState<Comment[]>([]);
	const [commentBody, setCommentBody] = useState('');

	useEffect(() => {
		(async function fetchPost() {
			try {
				const response = await instance.get(`/forum/general/post/${id}`);
				const postData = response.data;
				const ymd = postData.date_created.substring(0, 10) + 'T';
				let hms =
					postData.date_created.substring(
						11,
						postData.date_created.indexOf('.')
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
				setPost({
					author: postData.author,
					email: postData.email,
					date: date,
					time: time,
					title: postData.title,
					body: postData.body
				});

				try {
					const response = await instance.get(`/forum/posts/${id}/comments`);
					setComments(response.data);
				} catch (error) {
					console.error('Error fetching comments:', error);
				}
			} catch (error) {
				console.error('Error fetching post:', error);
				navigate('/forum/general');
			}
		})();
	}, []);

	const handleCommentSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!commentBody) return;

		try {
			const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');
			const response = await instance.post(`/forum/posts/${id}/comments`, {
				author: userToken.username,
				body: commentBody,
				date_created: new Date().toISOString()
			});

			if (response.data.error) {
				throw new Error(response.data.error);
			}

			setComments([...comments, response.data]);
			setCommentBody('');
		} catch (error) {
			console.error('Error submitting comment:', error);
		}
	};

	const OUTLINE = useColorModeValue('gray.700', 'purple.700');
	const BG = useColorModeValue('white', 'gray.800');

	return (
		<Box mt={8} mx='auto' w='100%'>
			{post ? (
				<VStack
					w='100%'
					bg={OUTLINE}
					rounded='lg'
					boxShadow='lg'
					p={{ base: 1, sm: 1 }}
				>
					{isMobile ? (
						<MobileForumPost
							author={post.author}
							email={post.email}
							date={post.date}
							time={post.time}
							title={post.title}
							body={post.body}
						/>
					) : (
						<DesktopForumPost
							author={post.author}
							email={post.email}
							date={post.date}
							time={post.time}
							title={post.title}
							body={post.body}
						/>
					)}
				</VStack>
			) : (
				<></>
			)}
			<VStack spacing={4} align='left'>
				{localStorage.getItem('user') ? (
					<Box as='form' onSubmit={handleCommentSubmit} w='100%' pt={5}>
						<FormControl id='comment' isRequired>
							<FormLabel>Leave a Comment</FormLabel>
							<Textarea
								value={commentBody}
								onChange={(e) => setCommentBody(e.target.value)}
							/>
						</FormControl>
						<Button type='submit' colorScheme='purple' mt={4}>
							Submit
						</Button>
					</Box>
				) : (
					<></>
				)}
				<Heading as='h3' size='md' pt={5}>
					Comments
				</Heading>
				{comments.map((comment, index) => (
					<Box key={index} bg={BG} p={4} borderRadius='md' w='100%'>
						<Text fontSize='sm' color='gray.400' mb={2}>
							by {comment.author} on {comment.date} at {comment.time}
						</Text>
						<Text fontSize='md'>{comment.body}</Text>
					</Box>
				))}
			</VStack>
		</Box>
	);
}
