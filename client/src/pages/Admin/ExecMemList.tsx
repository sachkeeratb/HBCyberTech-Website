// List of executive members for admins to view

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
import { useNavigate } from 'react-router';

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

// Interface for executive member data
interface ExecutiveMember {
	full_name: string;
	email: string;
	grade: number;
	exec_type: string;
	why: string;
	experience: string;
	portfolio: string;
	extra: string;
	date: string;
	time: string;
}

// View an executive member for a desktop view
const DesktopEntry: React.FC<ExecutiveMember> = ({
	full_name,
	email,
	grade,
	exec_type,
	why,
	experience,
	portfolio,
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
						Grade {grade}{' '}
						{exec_type.charAt(0).toUpperCase() + exec_type.slice(1)}
					</Text>
				</Flex>
				<Text fontSize='sm' color='gray.400' align='right' overflow='hidden'>
					{date} at {time}
				</Text>
			</Flex>
			<Flex mt={4}>
				<Heading as='h3' size='sm' mb={2}>
					Why Do You Want to Be an Executive Member?
				</Heading>
			</Flex>
			<Flex>
				<Text fontSize='md' align='left' overflow='hidden'>
					{why}
				</Text>
			</Flex>{' '}
			<Flex mt={4}>
				<Heading as='h3' size='sm' mb={2}>
					What Experience Do You Have in This Area?
				</Heading>
			</Flex>
			<Flex>
				<Text fontSize='md' align='left' overflow='hidden'>
					{experience}
				</Text>
			</Flex>
			<Flex mt={4}>
				<Heading as='h3' size='sm' mb={2}>
					Portfolio
				</Heading>
			</Flex>
			<Flex>
				<Text fontSize='md' align='left' overflow='hidden'>
					{portfolio ? portfolio : 'None'}
				</Text>
			</Flex>
			<Flex mt={4}>
				<Heading as='h3' size='sm' mb={2}>
					Additional Information
				</Heading>
			</Flex>
			<Flex>
				<Text fontSize='md' align='left' overflow='hidden'>
					{extra ? extra : 'None'}
				</Text>
			</Flex>
		</Box>
	);
};

// View an executive member for a mobile view
const MobileEntry: React.FC<ExecutiveMember> = ({
	full_name,
	email,
	grade,
	exec_type,
	why,
	experience,
	portfolio,
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
					Grade {grade} {exec_type.charAt(0).toUpperCase() + exec_type.slice(1)}
				</Text>
			</Flex>
			<Flex>
				<Text fontSize='sm' color='gray.400' align='left' overflow='hidden'>
					{date} at {time}
				</Text>
			</Flex>
			<Flex mt={4}>
				<Heading as='h3' size='sm' mb={2}>
					Why Do You Want to Be an Executive Member?
				</Heading>
			</Flex>
			<Flex>
				<Text fontSize='md' align='left' overflow='hidden'>
					{why}
				</Text>
			</Flex>{' '}
			<Flex mt={4}>
				<Heading as='h3' size='sm' mb={2}>
					What Experience Do You Have in This Area?
				</Heading>
			</Flex>
			<Flex>
				<Text fontSize='md' align='left' overflow='hidden'>
					{experience}
				</Text>
			</Flex>
			<Flex mt={4}>
				<Heading as='h3' size='sm' mb={2}>
					Portfolio
				</Heading>
			</Flex>
			<Flex>
				<Text fontSize='md' align='left' overflow='hidden'>
					{portfolio ? portfolio : 'None'}
				</Text>
			</Flex>
			<Flex mt={4}>
				<Heading as='h3' size='sm' mb={2}>
					Additional Information
				</Heading>
			</Flex>
			<Flex>
				<Text fontSize='md' align='left' overflow='hidden'>
					{extra ? extra : 'None'}
				</Text>
			</Flex>
		</Box>
	);
};

// Component to display a list of executive members
export default function ExecMemList() {
	// To navigate to different pages
	const navigate = useNavigate();

	// Check if the user is on mobile or desktop
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

	// State variable for the list of executive members
	const [members, setMembers] = useState<ExecutiveMember[]>([]);

	// State variables for the page number and whether there are more members
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

				// If the user is not an admin, remove the cookie and navigate to the home page
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

	// Fetch the list of executive members
	useEffect(() => {
		fetchMembers();
	}, [page, search, filter]);

	// Fetch the list of executive members from the database
	const fetchMembers = async () => {
		try {
			const response = await instance.post('/executive_member/get_all', {
				token: jwtDecode<{ token: string; exp: number }>(cookies.admin).token,
				page: page,
				limit: 3,
				search: search,
				field: filter
			});

			// Parse the response data and store it in the executive members array
			const execMemArr: ExecutiveMember[] = [];
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

				// Store the executive member data in an array
				const full_name = currItem.full_name;
				const email = currItem.email;
				const grade = currItem.grade;
				const exec_type = currItem.exec_type;
				const why = currItem.why;
				const experience = currItem.experience;
				const portfolio = currItem.portfolio;
				const extra = currItem.extra;
				execMemArr.push({
					full_name,
					email,
					grade,
					exec_type,
					why,
					experience,
					portfolio,
					extra,
					date,
					time
				});
			}
			// Store if there are more members
			setHasMore(execMemArr.length === 3);

			// Set the list of executive members
			setMembers(execMemArr);
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
				Executive Members
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
						<option value='marketing'>Marketing</option>
						<option value='events'>Events</option>
						<option value='development'>Development</option>
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
								exec_type={member.exec_type}
								why={member.why}
								experience={member.experience}
								portfolio={member.portfolio}
								extra={member.extra}
								date={member.date}
								time={member.time}
							/>
						) : (
							<DesktopEntry
								full_name={member.full_name}
								email={member.email}
								grade={member.grade}
								exec_type={member.exec_type}
								why={member.why}
								experience={member.experience}
								portfolio={member.portfolio}
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
