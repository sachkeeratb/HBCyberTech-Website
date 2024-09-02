// A home page for the general public to see what the club is about

// Chakra UI Components
import {
	Container,
	Heading,
	Text,
	SlideFade,
	chakra,
	SimpleGrid,
	Box,
	Icon
} from '@chakra-ui/react';

// Framer motion for animations
import { motion } from 'framer-motion';

// React Icons
import { MdOutlinePersonPin } from 'react-icons/md';
import { FaSlideshare, FaNetworkWired } from 'react-icons/fa';
import { GrWorkshop } from 'react-icons/gr';
import { IconType } from 'react-icons';

export default function Home() {
	return (
		<>
			<Container maxW='5xl' py={2} mx='auto'>
				<SlideFade in={true} offsetY='50vh'>
					<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
						<Heading
							fontWeight={600}
							fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
							lineHeight={'110%'}
							textAlign='center'
						>
							<Text textShadow='1px 1px #9c1786'>Welcome to </Text>
							<Text
								as={'span'}
								color={'blue.400'}
								bgGradient='linear(to-r, blue.200, purple.500)'
								bgClip='text'
							>
								HB CyberTech
							</Text>
						</Heading>
					</motion.div>
				</SlideFade>
			</Container>

			<Container maxW='6xl' p={{ base: 5, md: 10 }}>
				<SimpleGrid
					columns={{ base: 1, md: 2 }}
					placeItems='center'
					spacing={16}
					mt={12}
					mb={4}
				>
					{Features.map((feature, index) => (
						<Box key={index} textAlign='center'>
							{' '}
							<SlideFade in={true} offsetY='50vh'>
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<Icon as={feature.icon} w={10} h={10} color='blue.400' />
								</motion.div>
							</SlideFade>
							<chakra.h3 fontWeight='semibold' fontSize='2xl'>
								{feature.heading}
							</chakra.h3>
							<Text fontSize='md'>{feature.content}</Text>
						</Box>
					))}
				</SimpleGrid>
			</Container>
		</>
	);
}

// Features of the club and website
interface Feature {
	heading: string;
	content: string;
	icon: IconType;
}

const Features: Feature[] = [
	{
		heading: 'Informational Learning Sessions',
		content:
			'This club will provide a great amount of knowledge regarding CyberSecurity, Embedded Programming, and more!',
		icon: FaSlideshare
	},
	{
		heading: 'Networking',
		content:
			'Meet new people, make friends, and learn from each other! Create projects, show them online, and create connections with possible employers!',
		icon: FaNetworkWired
	},
	{
		heading: 'Activities and Workshops',
		content:
			'Instead of showing you a wall of text that will take a long time to read with forgettable words, we create wokshops and activities so you can learn through application and creation.',
		icon: GrWorkshop
	},
	{
		heading: 'Community',
		content:
			'We have a community of people who are passionate about learning and teaching. You can ask questions, share your knowledge, and help others in the forum!',
		icon: MdOutlinePersonPin
	}
];
