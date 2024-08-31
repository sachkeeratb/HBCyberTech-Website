import { useEffect, useState } from 'react';
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
import toast, { Toaster } from 'react-hot-toast';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';

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
							<Text
								fontSize='xl'
								fontWeight='bold'
								mr={2}
								align='left'
								overflow='hidden'
							>
								{title}
							</Text>
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
						<Text
							fontSize='xl'
							fontWeight='bold'
							mr={2}
							align='left'
							overflow='hidden'
						>
							{title}
						</Text>
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

const DesktopComment: React.FC<Comment> = (comment: Comment, BG: string) => {
	return (
		<Box bg={BG} p={5} borderRadius='md' minWidth={'100%'}>
			<Flex justify='space-between' align='center'>
				<Flex>
					<SlideFade in={true} offsetY='50vh'>
						<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
							<Text
								fontSize='xl'
								mt={1}
								align='left'
								fontWeight='bold'
								mr={2}
								overflow='hidden'
							>
								{comment.author} &lt;{comment.email}&gt;
							</Text>
						</motion.div>
					</SlideFade>
				</Flex>
				<Text fontSize='sm' color='gray.400' align='right' overflow='hidden'>
					{comment.date} at {comment.time}
				</Text>
			</Flex>
			<Flex mt={4}>
				<Text fontSize='md' align='left' overflow='hidden'>
					{comment.body}
				</Text>
			</Flex>
		</Box>
	);
};
const MobileComment: React.FC<Comment> = (comment: Comment, BG: string) => {
	return (
		<Box bg={BG} p={5} borderRadius='md' minWidth={'100%'}>
			<Flex direction='column' align='left'>
				<SlideFade in={true} offsetY='50vh'>
					<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
						<Text
							fontSize='md'
							fontWeight='bold'
							mr={2}
							align='left'
							overflow='hidden'
						>
							{comment.author} &lt;{comment.email}&gt;
						</Text>
					</motion.div>
				</SlideFade>
			</Flex>
			<Text fontSize='sm' color='gray.400' align='left' overflow='hidden'>
				{comment.date} at {comment.time}
			</Text>
			<Flex mt={4}>
				<Text fontSize='md' align='left' overflow='hidden'>
					{comment.body}
				</Text>
			</Flex>
		</Box>
	);
};

export default function Post() {
	const [cookies] = useCookies(['user']);
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
	const [error, setError] = useState(false);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	let lastPage = 0;

	useEffect(() => {
		if (cookies.user) {
			const decoded = jwtDecode<{
				username: string;
				email: string;
				verified: boolean;
			}>(cookies.user);
			setData({ ...data, author: decoded.username, email: decoded.email });
		}
	}, []);

	useEffect(() => {
		fetchPost();
	}, [id]);

	useEffect(() => {
		fetchComments();
	}, [hasMore]);

	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + document.documentElement.scrollTop ===
				document.documentElement.offsetHeight
			)
				fetchComments();
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [page]);

	const fetchPost = async () => {
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
		} catch (error) {
			console.error('Error fetching post:', error);
			navigate('/forum/general');
		}
	};

	const fetchComments = async () => {
		if (!hasMore) return;
		try {
			const response = await instance.post(
				`/forum/general/post/${id}/comments`,
				{
					page: page,
					limit: 3
				}
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
			if (page == lastPage) return;
			lastPage = page;

			setComments((prevComments) => [...prevComments, ...commentArr]);
			setHasMore(commentArr.length > 0);
			setPage((prevPage) => prevPage + 1);
		} catch (error) {
			console.error('Error fetching comments:', error);
		} finally {
			setLoading(false);
		}
	};
	// rather than the second page being loaded, the first page is loaded twice, which leads to duplicated comments

	const handleCommentSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (error) {
			toast.error('Invalid values.');
			return;
		}

		const lastCommentTime = localStorage.getItem('lastCommentTime');
		const now = new Date().getTime();
		if (lastCommentTime && now - parseInt(lastCommentTime) < 10 * 60 * 1000) {
			toast.error('You must wait 10 minutes between posting comments.');
			return;
		} else localStorage.setItem('lastCommentTime', now.toString());

		if (!cookies.user) {
			toast.error('You must be signed in to post a comment.');
			return;
		}
		if (
			!jwtDecode<{
				username: string;
				email: string;
				verified: boolean;
			}>(cookies.user).verified
		) {
			toast.error('You must verify your email before posting a comment.');
			return;
		}

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
			<Toaster
				position='bottom-right'
				reverseOrder={false}
				toastOptions={{
					style: {
						color: useColorModeValue('black', 'white'),
						background: useColorModeValue('#F2F3F4', '#181818')
					}
				}}
			/>
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
			<VStack spacing={4} align='center'>
				{cookies.user ? (
					<Box as='form' onSubmit={handleCommentSubmit} w='100%' pt={5}>
						<FormControl id='comment' isRequired isInvalid={error}>
							<FormLabel>Leave a Comment</FormLabel>
							<Textarea
								value={data.body}
								onChange={(e) => {
									setError(
										e.target.value.length > 600 || e.target.value.length < 20
									);
									setData({ ...data, body: e.target.value });
								}}
							/>
							{error ? (
								data.body.length <= 600 ? (
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
								)
							) : (
								<></>
							)}
						</FormControl>
						<Button type='submit' colorScheme='purple' mt={4}>
							Submit
						</Button>
					</Box>
				) : (
					<></>
				)}
				<Heading as='h1' size='lg' pt={5}>
					Comments
				</Heading>
				<VStack
					w='80%'
					bg={OUTLINE}
					spacing={4}
					rounded='lg'
					boxShadow='lg'
					p={{ base: 1, sm: 1 }}
				>
					{comments.map((comment, index) => (
						<Box key={index} bg={BG} p={4} borderRadius='md' w='100%'>
							{isMobile
								? MobileComment(comment, BG)
								: DesktopComment(comment, BG)}
						</Box>
					))}
				</VStack>
			</VStack>
			<Box mt={4} display='flex' justifyContent='space-between'>
				{loading && <Text>Loading...</Text>}
				{!hasMore && <Text>No more comments</Text>}
			</Box>
		</Box>
	);
}
