// General discussion page for users

// React and Chakra UI components
import { useEffect, useState } from 'react';
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

// Axios for making HTTP requests
import axios from 'axios';

// Framer Motion for animations
import { Link } from 'react-router-dom';

// Cookies for storing user data
import { motion } from 'framer-motion';

// Cookies for storing user data
import { useCookies } from 'react-cookie';

// Toast notifications
import toast, { Toaster } from 'react-hot-toast';

// To decode JWT tokens
import { jwtDecode } from 'jwt-decode';

// Define the shape of the forum post
interface ForumPost {
	id: string;
	author: string;
	email: string;
	date: string;
	time: string;
	title: string;
	body: string;
}

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

// Main component for displaying the general discussion forum
export default function General() {
	// Check if the user is on a mobile device
	const [isMobile, setIsMobile] = useState(
		typeof window !== 'undefined' && window.innerWidth < 1024
	);

	// Update the isMobile state when the window is resized
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

	// Get the user and admin cookies
	const [cookies] = useCookies(['user', 'admin']);

	// Store the forum posts
	const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);

	// Store the pagination arguments
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState('title');

	// Fetch forum posts from the server
	useEffect(() => {
		fetchForumPosts();
	}, [page, search, filter]);

	// Fetch forum posts from the server
	const fetchForumPosts = async () => {
		try {
			const response = await instance.post('/forum/general/get', {
				page: page,
				limit: 10,
				search: search,
				field: filter
			});

			// Parse the response data
			const postArr: ForumPost[] = [];
			for (let i = 0; i < response.data.length; i++) {
				// Store the current item in a variable
				const currItem = JSON.parse(JSON.stringify(response.data[i]));

				// Get the date and time of the post
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

				// Store the post data in the array
				const id = currItem.id;
				const author = currItem.author;
				const email = currItem.email;
				const title = currItem.title;
				const body = currItem.body;
				postArr.push({ id, author, email, date, time, title, body });
			}
			// Store if there are more posts
			setHasMore(postArr.length === 10);

			// Store the posts in the forumPosts array
			setForumPosts(postArr);
		} catch (error) {
			console.error('Error fetching announcements:', error);
		}
	};

	// Function for a user to delete their own post
	const deleteUserPost = async (id: string) => {
		try {
			const response = await instance.delete(`/forum/general/delete/${id}`, {
				headers: {
					Authorization: cookies.user
				}
			});

			if (response.status === 200) {
				toast.success('Post deleted successfully');
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			}
		} catch (error) {
			toast.error('Failed to delete post');
			console.error(error);
		}
	};

	// Function for an admin to delete a post
	const deleteAdminPost = async (id: string) => {
		try {
			const response = await instance.delete(
				`/forum/general/delete/as_admin/${id}`,
				{
					headers: {
						Authorization: cookies.admin
					}
				}
			);

			if (response.status === 200) {
				toast.success('Post deleted successfully');
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			}
		} catch (error) {
			toast.error('Failed to delete post');
			console.error(error);
		}
	};

	// Function to handle the search input
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
		setPage(1);
		setForumPosts([]);
		setHasMore(true);
	};

	// Set the colours of the list based on the colour mode
	const BG = useColorModeValue('gray.700', 'purple.700');
	const POST_BG = useColorModeValue('white', 'gray.800');

	// Set the toast colour and its background colour based on the colour mode
	const toastColour = useColorModeValue('black', 'white');
	const bgColour = useColorModeValue('#F2F3F4', '#181818');

	return (
		<Box>
			<Toaster
				position='bottom-right'
				reverseOrder={false}
				toastOptions={{
					style: {
						color: toastColour,
						background: bgColour
					}
				}}
			/>
			<Heading as='h1' size='xl' mt={4}>
				General Discussion
				<Flex justify='right' mb={4}>
					<Link to='/forum/general/create'>
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
									<Box bg={POST_BG} p={5} borderRadius='md' minWidth={'100%'}>
										<Flex direction='column' align='left'>
											<SlideFade in={true} offsetY='50vh'>
												<motion.div
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
												>
													<Link to={'/forum/general/' + forumPost.id}>
														<Text
															fontSize='xl'
															fontWeight='bold'
															mr={2}
															align='left'
															overflow='hidden'
														>
															{forumPost.title}
														</Text>
													</Link>
												</motion.div>
											</SlideFade>
										</Flex>

										<Text
											fontSize='md'
											color='gray.400'
											align='left'
											overflow='hidden'
										>
											by {forumPost.author} &lt;{forumPost.email}&gt;
										</Text>
										<Text
											fontSize='sm'
											color='gray.400'
											align='left'
											overflow='hidden'
										>
											{forumPost.date} at {forumPost.time}
										</Text>
										<Flex mt={4}>
											<Text fontSize='md' align='left' overflow='hidden'>
												{forumPost.body}
											</Text>
										</Flex>
										<Flex mt={2}>
											{cookies.user &&
											jwtDecode<{
												username: string;
												email: string;
												verified: boolean;
											}>(cookies.user).username === forumPost.author ? (
												<Button
													colorScheme='red'
													onClick={() => deleteUserPost(forumPost.id)}
												>
													Delete
												</Button>
											) : cookies.admin ? (
												<Button
													colorScheme='red'
													onClick={() => deleteAdminPost(forumPost.id)}
												>
													Delete
												</Button>
											) : (
												<></>
											)}
										</Flex>
									</Box>
								) : (
									<Box bg={POST_BG} p={5} borderRadius='md' minWidth={'100%'}>
										<Flex justify='space-between' align='center'>
											<Flex>
												<SlideFade in={true} offsetY='50vh'>
													<motion.div
														whileHover={{ scale: 1.1 }}
														whileTap={{ scale: 0.9 }}
													>
														<Link to={'/forum/general/' + forumPost.id}>
															<Text
																fontSize='xl'
																fontWeight='bold'
																mr={2}
																align='left'
																overflow='hidden'
															>
																{forumPost.title}
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
													by {forumPost.author} &lt;{forumPost.email}&gt;
												</Text>
											</Flex>
											<Text fontSize='sm' color='gray.400' overflow='hidden'>
												{forumPost.date} at {forumPost.time}
											</Text>
										</Flex>
										<Flex mt={4} justify='space-between'>
											<Text fontSize='md' align='left' overflow='hidden'>
												{forumPost.body}
											</Text>
											{cookies.user &&
											jwtDecode<{
												username: string;
												email: string;
												verified: boolean;
											}>(cookies.user).username === forumPost.author ? (
												<Button
													colorScheme='red'
													onClick={() => deleteUserPost(forumPost.id)}
												>
													Delete
												</Button>
											) : cookies.admin ? (
												<Button
													colorScheme='red'
													onClick={() => deleteAdminPost(forumPost.id)}
												>
													Delete
												</Button>
											) : (
												<></>
											)}
										</Flex>
									</Box>
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
