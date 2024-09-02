// List of general members for admins to view

// React and Chakra UI components
import { useEffect, useState } from 'react';
import {
	Box,
	Heading,
	Text,
	Button,
	Flex,
	Input,
	Select,
	SlideFade,
	useColorModeValue,
	VStack
} from '@chakra-ui/react';

// Axios for making HTTP requests
import axios from 'axios';

// Cookies for storing user data
import { useCookies } from 'react-cookie';

// To decode JWT tokens
import { jwtDecode } from 'jwt-decode';

// Framer Motion for animations
import { motion } from 'framer-motion';

// To navigate to different pages
import { useNavigate } from 'react-router-dom';

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

// Interface for general member data
interface GeneralMember {
	full_name: string;
	email: string;
	grade: number;
	skills: number;
	extra: string;
	date: string;
	time: string;
}

// View a general member entry for a desktop view
const DesktopEntry: React.FC<GeneralMember> = ({
	full_name,
	email,
	grade,
	skills,
	extra,
	date,
	time
}) => {
	const BG = useColorModeValue('white', 'gray.800');
	return (
		<Box bg={BG} p={5} borderRadius='md' minWidth={'100%'}>
			<Flex justify='space-between'>
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
								{full_name} &lt;{email}&gt;
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
						Grade {grade}
					</Text>
				</Flex>
				<Text fontSize='sm' color='gray.400' align='right' overflow='hidden'>
					{date} at {time}
				</Text>
			</Flex>
			<Flex>
				<Text fontSize='md' align='left' overflow='hidden'>
					Skills: {skills}%
				</Text>
			</Flex>
			<Flex>
				<Text fontSize='md' align='left' overflow='hidden'>
					{extra ? extra : 'None'}
				</Text>
			</Flex>
		</Box>
	);
};

// View a general member entry for a mobile view
const MobileEntry: React.FC<GeneralMember> = ({
	full_name,
	email,
	grade,
	skills,
	extra,
	date,
	time
}) => {
	const BG = useColorModeValue('white', 'gray.800');
	return (
		<Box bg={BG} p={5} borderRadius='md' minWidth={'100%'} textAlign='left'>
			<Flex justify='space-between'>
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
								{full_name} &lt;{email}&gt;
							</Text>
						</motion.div>
					</SlideFade>
				</Flex>
			</Flex>
			<Flex>
				<Text
					fontSize='md'
					color='gray.400'
					mt={1}
					align='left'
					overflow='hidden'
				>
					Grade {grade}
				</Text>
			</Flex>
			<Flex>
				<Text fontSize='sm' color='gray.400' align='left' overflow='hidden'>
					{date} at {time}
				</Text>
			</Flex>
			<Flex>
				<Text fontSize='md' align='left' overflow='hidden'>
					Skills: {skills}%
				</Text>
			</Flex>
			<Flex>
				<Text fontSize='md' align='left' overflow='hidden'>
					{extra ? extra : 'None'}
				</Text>
			</Flex>
		</Box>
	);
};

// Component to display a list of general members
export default function GenMemList() {
	// To navigate to different pages
	const navigate = useNavigate();

	// Check if the user is on a mobile device
	const [isMobile, setIsMobile] = useState(
		typeof window !== 'undefined' && window.innerWidth < 1024
	);

	// Check if the user's screen has resized to mobile
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

	// Cookies for storing and removing user data
	const [cookies, , removeCookie] = useCookies(['user', 'admin']);

	// State variables for general member data
	const [members, setMembers] = useState<GeneralMember[]>([]);

	// State variables for pagination
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState('full_name');

	// Check if the user is an admin
	useEffect(() => {
		if (!cookies.admin) navigate('/');
		(async function verify() {
			try {
				const request = await instance.post('/admin/verify', {
					token: cookies.admin
				});

				// If the user is not an admin, remove the cookie and redirect to the home page
				if (request.data !== true) {
					removeCookie('admin');
					navigate('/');
				}
			} catch (error) {
				console.error(error);
				navigate('/');
			}
		})();
	}, []);

	// Fetch general members from the database
	useEffect(() => {
		fetchMembers();
	}, [page, filter, search]);

	// Fetch general members from the database
	const fetchMembers = async () => {
		try {
			const response = await instance.post('/general_member/get_all', {
				token: jwtDecode<{ token: string; exp: number }>(cookies.admin).token,
				page: page,
				limit: 5,
				search: search,
				field: filter
			});

			// Parse the response data and store it in the general members array
			const genMemArr: GeneralMember[] = [];
			for (let i = 0; i < response.data.length; i++) {
				// Create a variable for the current item
				const currItem = JSON.parse(JSON.stringify(response.data[i]));

				// Get the date and time of the application
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

				// Store the general member data in an array
				const full_name = currItem.full_name;
				const email = currItem.email;
				const grade = currItem.grade;
				const skills = currItem.skills;
				const extra = currItem.extra;
				genMemArr.push({
					full_name,
					email,
					grade,
					skills,
					extra,
					date,
					time
				});
			}
			// Store if there are more members
			setHasMore(genMemArr.length === 5);

			// Set the list of executive members
			setMembers(genMemArr);
		} catch (error) {
			console.error(error);
		}
	};

	// Handle the search input
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
		setPage(1);
		setMembers([]);
		setHasMore(true);
	};

	// Set the background and outline colors based on the color mode
	const OUTLINE = useColorModeValue('gray.700', 'purple.700');
	const BG = useColorModeValue('white', 'gray.800');

	return (
		<Box mt={8} mx='auto' w='100%'>
			<Heading as='h1' size='xl' mb={6}>
				General Members
			</Heading>
			<Box>
				<Flex justifyContent='space-between'>
					<Input
						placeholder='Search members...'
						value={search}
						onChange={handleSearchChange}
						mb={4}
						maxWidth={'74%'}
					/>
					<Select
						maxWidth='25%'
						onChange={(e) => setFilter(e.target.value)}
						defaultValue='full_name'
					>
						<option value='full_name'>Full Name</option>
						<option value='email'>Email</option>
						<option value='grade'>Grade</option>
					</Select>
				</Flex>
			</Box>
			<VStack
				w='100%'
				align='center'
				bg={OUTLINE}
				spacing={4}
				rounded='lg'
				boxShadow='lg'
				p={{ base: 1, sm: 1 }}
			>
				{members.map((member, index) => (
					<Box key={index} bg={BG} p={4} borderRadius='md' w='100%'>
						{isMobile ? (
							<MobileEntry
								full_name={member.full_name}
								email={member.email}
								grade={member.grade}
								skills={member.skills}
								extra={member.extra}
								date={member.date}
								time={member.time}
							/>
						) : (
							<DesktopEntry
								full_name={member.full_name}
								email={member.email}
								grade={member.grade}
								skills={member.skills}
								extra={member.extra}
								date={member.date}
								time={member.time}
							/>
						)}
					</Box>
				))}
			</VStack>
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
		</Box>
	);
}
