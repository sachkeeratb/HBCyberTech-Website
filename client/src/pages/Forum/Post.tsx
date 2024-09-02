// The view of a singular post in the forum

// React and Chakra UI components
import { useEffect, useState } from 'react';
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
	FormErrorMessage,
	Input,
	Select
} from '@chakra-ui/react';

// Axios for making HTTP requests
import axios from 'axios';

// To navigate to different pages and get parameters from the function
import { useNavigate, useParams } from 'react-router-dom';

// Cookies for storing user data
import { motion } from 'framer-motion';

// To decode JWT tokens
import toast, { Toaster } from 'react-hot-toast';

// Cookies for storing user data
import { useCookies } from 'react-cookie';

// To decode JWT tokens
import { jwtDecode } from 'jwt-decode';

// Create an instance of axios with custom configurations
const instance = axios.create({
	baseURL: import.meta.env.VITE_AXIOS_BASE_URL, // Base URL for API requests
	timeout: 60000, // Request timeout in milliseconds
	withCredentials: false, // Whether to send cookies with the request
	headers: {
		'Access-Control-Allow-Origin': '*', // Allow requests from any origin
		'Access-Control-Allow-Methods': '*', // Allow any HTTP method
		'Access-Control-Allow-Headers': '*', // Allow any headers
		'Content-Type': 'application/json' // Set the content type to JSON
	}
});

// Define the data types
interface CommentRequest {
	author: string;
	email: string;
	date_created: string;
	body: string;
}

interface Comment {
	id: string;
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

// The view of a singular post in the forum with a desktop layout
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
// The view of a singular post in the forum with a mobile layout
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

// The main function for the post view
export default function Post() {
	// Get the cookies and removeCookie function
	const [cookies, , removeCookie] = useCookies(['user', 'admin']);

	// Get the navigate function
	const navigate = useNavigate();

	// Store if the user is on a mobile device
	const [isMobile, setIsMobile] = useState(
		typeof window !== 'undefined' && window.innerWidth < 1024
	);

	// Check if the user resized the window
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

	// Get the post ID from the parameters
	const { id } = useParams<{ id: string }>();

	// Store the post and comments
	const [post, setPost] = useState<ForumPost | null>(null);
	const [comments, setComments] = useState<Comment[]>([]);

	// Store the comment data and error states
	const [data, setData] = useState<CommentRequest>({
		author: '',
		email: '',
		date_created: '',
		body: ''
	});
	const [error, setError] = useState(false);

	// Store the pagination arguments
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState('author');

	// Weird fix for a bug
	let lastPage = 0;

	// Verify the cookies and get the user's information
	useEffect(() => {
		// If the user is signed in
		if (cookies.user) {
			// Decode the JWT token
			const decoded = jwtDecode<{
				username: string;
				email: string;
				verified: boolean;
			}>(cookies.user);
			// Set the user's information
			setData({ ...data, author: decoded.username, email: decoded.email });
		}
		// If the admin is signed in
		else if (cookies.admin) {
			// Verify the admin's token
			(async function verify() {
				try {
					const request = await instance.post('/admin/verify', {
						token: cookies.admin
					});

					// If the token is valid
					if (request.data === true) {
						// Set the admin's information
						setData({
							...data,
							author: 'The Team',
							email: import.meta.env.VITE_EMAIL
						});
					}
					// If the token is invalid
					else {
						// Remove the admin cookie and navigate to the home page
						removeCookie('admin');
						navigate('/');
					}
				} catch (error) {
					console.error(error);
					navigate('/');
				}
			})();
		}
	}, []);

	// Fetch the post data
	useEffect(() => {
		fetchPost();
	}, [id]);

	// Fetch the comments
	useEffect(() => {
		fetchComments();
	}, [search, filter, hasMore]);

	// Load more comments when the user scrolls to the bottom of the page
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

	// Fetch the post data
	const fetchPost = async () => {
		try {
			// Fetch the post data and store it
			const response = await instance.get(`/forum/general/post/${id}`);
			const postData = response.data;

			// Get the date and time of the post
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

			// Set the post data
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

	// Fetch the comments
	const fetchComments = async () => {
		// If there are no more comments or the page is loading, stop
		if (!hasMore || loading) return;
		setLoading(true);
		try {
			const response = await instance.post(
				`/forum/general/post/${id}/comments`,
				{
					page: page,
					limit: 3,
					search: search,
					field: filter
				}
			);

			// Store the comments
			const commentArr: Comment[] = [];
			for (let i = 0; i < response.data.length; i++) {
				// Store the current item in a variable
				const currItem = JSON.parse(JSON.stringify(response.data[i]));

				// Get the date and time of the comment
				const ymd = currItem.date_created.toString().substring(0, 10) + 'T';
				let hms =
					currItem.date_created
						.toString()
						.substring(11, currItem.date_created.toString().indexOf('.')) +
					'.000Z';
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

				// Store the comment data
				const id = currItem.id;
				const author = currItem.author;
				const email = currItem.email;
				const body = currItem.body;
				commentArr.push({ id, author, email, date, time, body });
			}

			// Weird fix for a bug
			if (page == lastPage) return;
			lastPage = page;

			// Store if there are more comments
			setHasMore(commentArr.length > 0);

			// Set the comments
			setComments((prevComments) => [...prevComments, ...commentArr]);

			// Increment the page number
			setPage((prevPage) => prevPage + 1);
		} catch (error) {
			console.error('Error fetching comments:', error);
		} finally {
			// Stop loading
			setLoading(false);
		}
	};

	// Submit a comment
	const handleCommentSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		// Check if the comment is valid
		if (error) {
			toast.error('Invalid values.');
			return;
		}

		// Check if the user is allowed to post a comment
		const lastCommentTime = localStorage.getItem('lastCommentTime');
		const now = new Date().getTime();

		// If the user has posted a comment in the last 10 minutes, they must wait
		if (lastCommentTime && now - parseInt(lastCommentTime) < 10 * 60 * 1000) {
			toast.error('You must wait 10 minutes between posting comments.');
			return;
		}
		// Otherwise, store the current time
		else localStorage.setItem('lastCommentTime', now.toString());

		// Check if the user is signed in
		if (!cookies.user && !cookies.admin) {
			toast.error('You must be signed in to post a comment.');
			return;
		}

		// Check if the user has verified
		if (
			!cookies.admin &&
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

			// Check if there was an error
			if (response.data.error) {
				throw new Error(response.data.error);
			}

			// Reset the comment data and show a success message
			setData({} as CommentRequest);
			toast.success('Comment successful.');
			new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
				window.location.reload();
			});
		} catch (error) {
			console.error('Error submitting comment:', error);
		}
	};

	// For a user to delete their own comments
	const deleteUserComment = async (commentID: string) => {
		try {
			const response = await instance.delete(
				`/forum/general/delete/${id}/comments/${commentID}`,
				{
					headers: {
						Authorization: cookies.user
					}
				}
			);

			if (response.status === 200) {
				toast.success('Comment deleted successfully');
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			}
		} catch (error) {
			toast.error('Failed to delete comment');
			console.error(error);
		}
	};

	// For an admin to delete comments
	const deleteAdminComment = async (commentID: string) => {
		try {
			const response = await instance.delete(
				`/forum/general/delete/as_admin/${id}/comments/${commentID}`,
				{
					headers: {
						Authorization: cookies.admin
					}
				}
			);

			if (response.status === 200) {
				toast.success('Comment deleted successfully');
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			}
		} catch (error) {
			toast.error('Failed to delete comment');
			console.error(error);
		}
	};

	// Handle the search change
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
		setPage(1);
		setComments([]);
		setHasMore(true);
	};

	// Set the colors based on the color mode
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
				{cookies.user || cookies.admin ? (
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
				<Box width='75%'>
					<Flex justifyContent='space-between'>
						<Input
							placeholder='Search comments...'
							value={search}
							onChange={handleSearchChange}
							mb={4}
							maxWidth={'74%'}
						/>
						<Select
							maxWidth='25%'
							onChange={(e) => setFilter(e.target.value)}
							defaultValue='author'
						>
							<option value='author'>Author</option>
							<option value='email'>Email</option>
						</Select>
					</Flex>
				</Box>
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
							{isMobile ? (
								<Box bg={BG} p={5} borderRadius='md' minWidth={'100%'}>
									<Flex direction='column' align='left'>
										<SlideFade in={true} offsetY='50vh'>
											<motion.div
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.9 }}
											>
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
									<Text
										fontSize='sm'
										color='gray.400'
										align='left'
										overflow='hidden'
									>
										{comment.date} at {comment.time}
									</Text>
									<Flex mt={4}>
										<Text fontSize='md' align='left' overflow='hidden'>
											{comment.body}
										</Text>
									</Flex>
								</Box>
							) : (
								<Box bg={BG} p={5} borderRadius='md' minWidth={'100%'}>
									<Flex justify='space-between' align='center'>
										<Flex>
											<SlideFade in={true} offsetY='50vh'>
												<motion.div
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
												>
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
										<Text
											fontSize='sm'
											color='gray.400'
											align='right'
											overflow='hidden'
										>
											{comment.date} at {comment.time}
										</Text>
									</Flex>
									<Flex mt={4} justifyContent='space-between'>
										<Text fontSize='md' align='left' overflow='hidden'>
											{comment.body}
										</Text>
										{cookies.user &&
										jwtDecode<{
											username: string;
											email: string;
											verified: boolean;
										}>(cookies.user).username === comment.author ? (
											<Button
												colorScheme='red'
												onClick={() => deleteUserComment(comment.id)}
											>
												Delete
											</Button>
										) : cookies.admin ? (
											<Button
												colorScheme='red'
												onClick={() => deleteAdminComment(comment.id)}
											>
												Delete
											</Button>
										) : (
											<></>
										)}
									</Flex>
								</Box>
							)}
						</Box>
					))}
				</VStack>
				<VStack spacing={4}>
					<Box mt={4} display='flex' justifyContent='space-between'>
						{loading && <Text>Loading...</Text>}
						{!hasMore && <Text>No more comments</Text>}
					</Box>
				</VStack>
			</VStack>
		</Box>
	);
}
