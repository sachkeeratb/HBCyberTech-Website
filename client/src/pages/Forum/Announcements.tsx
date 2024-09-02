// Displaying announcements

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
import { motion } from 'framer-motion';

// Link for navigation
import { Link } from 'react-router-dom';

// Cookies for storing user data
import { useCookies } from 'react-cookie';

// Toast notifications
import toast, { Toaster } from 'react-hot-toast';

// Define the shape of the announcement
interface Announcement {
	id: string;
	author: string;
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

// Main component for displaying announcements
export default function Announcements() {
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

	// Cookies for managing users
	const [cookies] = useCookies(['admin']);

	// Store the announcements
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);

	// Store the arguments for pagination
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState('title');

	// Fetch announcements from the server
	useEffect(() => {
		fetchAnnouncements();
	}, [page, search, filter]);

	// Function to fetch announcements
	const fetchAnnouncements = async () => {
		try {
			const response = await instance.post('/forum/announcements/get', {
				page: page,
				limit: 10,
				search: search,
				field: filter
			});

			// Parse the response data and store it in the announcements array
			const anouncementArr: Announcement[] = [];
			for (let i = 0; i < response.data.length; i++) {
				// Create a variable for the current item
				const currItem = JSON.parse(JSON.stringify(response.data[i]));

				// Extract the date and time from the given date
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
				const id = currItem.id;
				const author = currItem.author;
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

				// Store the announcement data in an array
				const title = currItem.title;
				const body = currItem.body;
				anouncementArr.push({ id, author, date, time, title, body });
			}
			// Store if there are more announcements
			setHasMore(anouncementArr.length === 10);

			// Update the announcements array
			setAnnouncements(anouncementArr);
		} catch (error) {
			console.error('Error fetching announcements:', error);
		}
	};

	// Function to delete an announcement for admins
	const deleteAnnouncement = async (id: string) => {
		try {
			const response = await instance.delete(
				`/forum/announcements/delete/${id}`,
				{
					headers: {
						Authorization: cookies.admin
					}
				}
			);

			// Display a success message if the post was deleted
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

	// Function to handle search input changes
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
		setPage(1);
		setAnnouncements([]);
		setHasMore(true);
	};

	// Set the colours based on the colour modes
	const BG = useColorModeValue('gray.700', 'purple.700');
	const POST_BG = useColorModeValue('white', 'gray.800');
	const toastColour = useColorModeValue('black', 'white');
	const toastBG = useColorModeValue('#F2F3F4', '#181818');

	return (
		<Box>
			<Toaster
				position='bottom-right'
				reverseOrder={false}
				toastOptions={{
					style: {
						color: toastColour,
						background: toastBG
					}
				}}
			/>
			<Heading as='h1' size='xl' mb={6} mt={4}>
				Announcements
				<Flex justify='right' mb={4}>
					{cookies.admin ? (
						<Link to='/forum/announcements/create'>
							<Button colorScheme='purple'>Create New Post</Button>
						</Link>
					) : (
						<></>
					)}
				</Flex>
			</Heading>
			<div>
				<Box>
					<Flex justifyContent='space-between'>
						<Input
							placeholder='Search announcements...'
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
						{announcements.map((announcement, key) => (
							<VStack spacing={4} w='100%' key={key}>
								{isMobile ? (
									<Box bg={POST_BG} p={5} borderRadius='md' minWidth={'100%'}>
										<Flex direction='column' align='left'>
											<SlideFade in={true} offsetY='50vh'>
												<motion.div
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
												>
													<Text
														fontSize='xl'
														fontWeight='bold'
														mr={2}
														align='left'
														overflow='hidden'
													>
														{announcement.title}
													</Text>
												</motion.div>
											</SlideFade>
											<Text
												fontSize='md'
												color='gray.400'
												align='left'
												overflow='hidden'
											>
												by {announcement.author}
											</Text>
										</Flex>
										<Text
											fontSize='sm'
											color='gray.400'
											align='left'
											overflow='hidden'
										>
											{announcement.date} at {announcement.time}
										</Text>
										<Flex mt={4}>
											<Text fontSize='md' align='left' overflow='hidden'>
												{announcement.body}
											</Text>
										</Flex>
										<Flex mt={2}>
											{cookies.admin ? (
												<Button
													colorScheme='red'
													onClick={() => deleteAnnouncement(announcement.id)}
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
														<Text
															fontSize='xl'
															fontWeight='bold'
															mr={2}
															align='left'
															overflow='hidden'
														>
															{announcement.title}
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
													by {announcement.author}
												</Text>
											</Flex>
											<Text
												fontSize='sm'
												color='gray.400'
												align='right'
												overflow='hidden'
											>
												{announcement.date} at {announcement.time}
											</Text>
										</Flex>
										<Flex mt={4}>
											<Text fontSize='md' align='left' overflow='hidden'>
												{announcement.body}
											</Text>
										</Flex>
										<Flex mt={2}>
											{cookies.admin ? (
												<Button
													colorScheme='red'
													onClick={() => deleteAnnouncement(announcement.id)}
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
