import {
	Box,
	Button,
	chakra,
	Container,
	Heading,
	SlideFade,
	Stack,
	Text
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

export default function Links() {
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
								color={'green.400'}
								bgGradient='linear(to-r, green.200, gray.500)'
								bgClip='text'
							>
								Links
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
		label: 'Google Classroom',
		href: 'https://classroom.google.com/'
	},
	{
		label: 'General Member Form',
		href: '/form/general'
	},
	{
		label: 'Executive Member Form',
		href: '/form/executive'
	},
	{
		label: 'Instagram Account',
		href: 'https://www.instagram.com/hbcybertech'
	}
];
