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
	SlideFade,
	FormErrorMessage
} from '@chakra-ui/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

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

interface CommentRequest {
	author: string;
	email: string;
	date_created: string;
	body: string;
}

interface Comment {
	author: string;
	email: string;
	date: string;
	time: string;
	body: string;
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

const DesktopComment: React.FC<Comment> = (comment: Comment) => {
	const BG = useColorModeValue('white', 'gray.800');
	return (
		<Box bg={BG} p={5} borderRadius='md' minWidth={'100%'}>
			<Flex justify='space-between' align='center'>
				<Flex>
					<SlideFade in={true} offsetY='50vh'>
						<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
							<Text fontSize='xl' mt={1} align='left' fontWeight='bold' mr={2}>
								{comment.author} &lt;{comment.email}&gt;
							</Text>
						</motion.div>
					</SlideFade>
				</Flex>
				<Text fontSize='sm' color='gray.400' align='right'>
					{comment.date} at {comment.time}
				</Text>
			</Flex>
			<Flex mt={4}>
				<Text fontSize='md' align='left'>
					{comment.body}
				</Text>
			</Flex>
		</Box>
	);
};
const MobileComment: React.FC<Comment> = (comment: Comment) => {
	const BG = useColorModeValue('white', 'gray.800');
	return (
		<Box bg={BG} p={5} borderRadius='md' minWidth={'100%'}>
			<Flex direction='column' align='left'>
				<SlideFade in={true} offsetY='50vh'>
					<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
						<Text fontSize='xl' fontWeight='bold' mr={2} align='left'>
							{comment.author} &lt;{comment.email}&gt;
						</Text>
					</motion.div>
				</SlideFade>
			</Flex>
			<Text fontSize='sm' color='gray.400' align='left'>
				{comment.date} at {comment.time}
			</Text>
			<Flex mt={4}>
				<Text fontSize='md' align='left'>
					{comment.body}
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
	const [data, setData] = useState<CommentRequest>({
		author: '',
		email: '',
		date_created: '',
		body: ''
	});

	useEffect(() => {
		if (localStorage.getItem('user')) {
			const token = JSON.parse(localStorage.getItem('user') || '{}');
			setData({ ...data, author: token.username, email: token.email });
		}
	}, []);

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
					const response = await instance.get(
						`/forum/general/post/${id}/comments`
					);
					const responseArr: CommentRequest[] = [];
					const commentArr: Comment[] = [];
					for (let i = 0; i < response.data.length; i++) {
						responseArr.push(JSON.parse(JSON.stringify(response.data[i])));
						const ymd =
							responseArr[i].date_created.toString().substring(0, 10) + 'T';
						let hms =
							responseArr[i].date_created
								.toString()
								.substring(
									11,
									responseArr[i].date_created.toString().indexOf('.')
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
						const author = responseArr[i].author;
						const email = responseArr[i].email;
						const body = responseArr[i].body;
						commentArr.push({ author, email, date, time, body });
					}
					setComments(commentArr);
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
		if (!data.body || data.body.length > 600 || data.body.length < 20) {
			toast.error('Invalid values.');
			return;
		}

		const lastCommentTime = localStorage.getItem('lastCommentTime');
		const now = new Date().getTime();
		if (lastCommentTime && now - parseInt(lastCommentTime) < 10 * 60 * 1000) {
			toast.error('You must wait 10 minutes between posting comments.');
			return;
		} else localStorage.setItem('lastCommentTime', now.toString());

		try {
			const { author, email, body } = data;
			const response = await instance.post(
				`/forum/general/post/${id}/comment`,
				{
					author: author,
					email: email,
					date_created: new Date().toISOString(),
					body: body
				}
			);
			console.log(response);

			if (response.data.error) {
				throw new Error(response.data.error);
			}

			setData({} as CommentRequest);
			toast.success('Comment successful.');
			new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
				window.location.reload();
			});
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
						<FormControl
							id='comment'
							isRequired
							isInvalid={data.body.length > 600 || data.body.length < 20}
						>
							<FormLabel>Leave a Comment</FormLabel>
							<Textarea
								value={data.body}
								onChange={(e) => setData({ ...data, body: e.target.value })}
							/>
							{data.body.length <= 600 ? (
								data.body.length < 20 ? (
									<FormErrorMessage>
										You must input a comment with a minimum of 20 characters.
									</FormErrorMessage>
								) : (
									<></>
								)
							) : (
								<FormErrorMessage>
									You are only allowed to input a maximum of 600 characters.
								</FormErrorMessage>
							)}
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
				<VStack
					w='100%'
					bg={OUTLINE}
					spacing={4}
					rounded='lg'
					boxShadow='lg'
					p={{ base: 1, sm: 1 }}
				>
					{comments.map((comment, index) => (
						<Box key={index} bg={BG} p={4} borderRadius='md' w='100%'>
							{isMobile ? MobileComment(comment) : DesktopComment(comment)}
						</Box>
					))}
				</VStack>
			</VStack>
		</Box>
	);
}
