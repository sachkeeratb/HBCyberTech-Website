import {
	Text,
	Container,
	SlideFade,
	Heading,
	Box,
	Stack,
	Button,
	chakra
} from '@chakra-ui/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const instance = axios.create({
	baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
	timeout: 60000,
	withCredentials: false,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': '*',
		'Access-Control-Allow-Headers': '*',
		'Content-Type': 'application/json'
	}
});

export default function AdminDashboard() {
	const navigate = useNavigate();
	const [cookies, , removeCookie] = useCookies(['user', 'admin']);

	useEffect(() => {
		if (!cookies.admin) navigate('/');
		(async function verify() {
			try {
				const request = await instance.post('/admin/verify', {
					token: cookies.admin
				});

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

	return (
		<>
			<Container maxW='5xl' py={2} pb={10} mx='auto'>
				<SlideFade in={true} offsetY='50vh'>
					<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
						<Heading
							fontWeight={600}
							fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
							lineHeight={'110%'}
							textAlign='center'
						>
							<Text
								as={'span'}
								color={'blue.400'}
								bgGradient='linear(to-r, blue.200, purple.500)'
								bgClip='text'
							>
								Admin Dashboard
							</Text>
						</Heading>
					</motion.div>
				</SlideFade>
			</Container>

			{LinksList.map((Link, i) => (
				<Box
					as='a'
					href={Link.href}
					role={'group'}
					display={'block'}
					p={2}
					rounded={'md'}
					key={i}
				>
					<Stack direction={'column'} align={'center'}>
						<Button mb={'7vh'}>
							<chakra.h3
								fontSize='2xl'
								transition={'all .3s ease'}
								_groupHover={{ color: 'purple.400' }}
								fontWeight={500}
							>
								{Link.label}
							</chakra.h3>
						</Button>
					</Stack>
				</Box>
			))}
		</>
	);
}

interface Link {
	label: string;
	href: string;
}

const LinksList: Link[] = [
	{
		label: 'Executive Member Applications',
		href: '/admin/executives'
	},
	{
		label: 'General Members List',
		href: '/admin/generals'
	},
	{
		label: 'Accounts List',
		href: '/admin/accounts'
	}
];
