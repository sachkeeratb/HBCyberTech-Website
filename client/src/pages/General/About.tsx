// A page that displays information about the club and its executives

// Chakra UI Components
import {
	Flex,
	Avatar,
	Box,
	Container,
	forwardRef,
	Link,
	Heading,
	SlideFade
} from '@chakra-ui/react';

// Framer Motion Components
import { motion, isValidMotionProp } from 'framer-motion';

// Import images
import ParthKapoor from '../../assets/ParthKapoor.png';
import GurvirSandhu from '../../assets/GurvirSandhu.png';
import UdeshwarSinghSandhu from '../../assets/UdeshwarSinghSandhu.png';
import PrathamDave from '../../assets/PrathamDave.jpg';
import VanshSuri from '../../assets/VanshSuri.png';
import EdwardLin from '../../assets/EdwardLin.jpg';
import NimayDesai from '../../assets/NimayDesai.png';
import SharunArunanthy from '../../assets/SharunArunanthy.png';
import VihaanShah from '../../assets/VihaanShah.png';
import DhruvParikh from '../../assets/DhruvParikh.png';
import IshaanDhillon from '../../assets/IshaanDhillon.png';
import KeyaShah from '../../assets/KeyaShah.png';
import DhyeyHansoti from '../../assets/DhyeyHansoti.png';

// Import icons
import {
	FaGithub as GitHubIcon,
	FaInstagram as InstagramIcon,
	FaLinkedin as LinkedInIcon
} from 'react-icons/fa';

// A Motion Box
export const MotionBox = motion(
	forwardRef((props, ref) => {
		const chakraProps = Object.fromEntries(
			Object.entries(props).filter(([key]) => !isValidMotionProp(key))
		);
		return <Box ref={ref} {...chakraProps} />;
	})
);

// Social Media Contact Links
const GitHubContact = (link: string) => {
	return (
		<Link href={link} isExternal>
			<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
				<GitHubIcon />
			</MotionBox>
		</Link>
	);
};
const InstagramContact = (link: string) => {
	return (
		<Link href={link} isExternal>
			<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
				<InstagramIcon />
			</MotionBox>
		</Link>
	);
};
const LinkedInContact = (link: string) => {
	return (
		<Link href={link} isExternal>
			<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
				<LinkedInIcon />
			</MotionBox>
		</Link>
	);
};

export function AboutCore() {
	return (
		<Container maxW='7xl' p='12'>
			{/* About Us */}
			<SlideFade in={true} offsetY='50vh'>
				<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
					<Heading
						fontWeight={600}
						fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
						lineHeight={'110%'}
						textAlign='center'
						mb={10}
					>
						<Box
							as={'span'}
							color={'blue.400'}
							bgGradient='linear(to-r, blue.200, purple.500)'
							bgClip='text'
						>
							The Core Team
						</Box>
					</Heading>
				</motion.div>
			</SlideFade>

			{/* President */}
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src='https://avatars.githubusercontent.com/u/61165141?v=4'
							/>
						</MotionBox>
					</Box>
				</div>

				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									President
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>
								<Box as='span' display={'flex'} pt={5}>
									<Box pr={5}>
										{GitHubContact('https://github.com/sachkeeratb')}
									</Box>
									<Box pr={5}>
										{InstagramContact('https://www.instagram.com/sachkeeratb')}
									</Box>
									{LinkedInContact(
										'https://www.linkedin.com/in/sachkeeratbrar'
									)}
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left'>
						Hello! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Sachkeerat Singh Brar
						</Box>{' '}
						and I&apos;m the president of this club. I am a Full Stack
						Developer, but I also have an affinity for the lower levels of
						programming. In my free time, I like to read, study, and play video
						games, especially mass-multiplayer FPSs.
					</Box>
					<Box
						as='h2'
						fontSize='xl'
						fontWeight='400'
						mt={5}
						pb={10}
						textAlign='left'
					>
						I hope you enjoy learning and creating in this space. Happy coding!
					</Box>
				</Flex>
			</Flex>

			{/* Vice Presidents */}
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={UdeshwarSinghSandhu}
							/>
						</MotionBox>
					</Box>
				</div>

				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Vice President
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									<Box>
										{InstagramContact(
											'https://www.instagram.com/udesh_awesome'
										)}
									</Box>
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Hi! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Udeshwar Singh Sandhu{' '}
						</Box>
						and I am a VP of HB Cybertech. I have a strong passion for
						programming and enjoy innovative technology. If you are want more
						info about cyber security and cool technology, check out HB
						CyberTech.
					</Box>
				</Flex>
			</Flex>
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={EdwardLin}
							/>
						</MotionBox>
					</Box>
				</div>

				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Vice President
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									<Box pr={5}>
										{GitHubContact('https://github.com/TheNobleCoder')}
									</Box>
									<Box>
										{InstagramContact('https://www.instagram.com/edyi_01')}
									</Box>
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Greetings! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Edward Lin{' '}
						</Box>
						and I am the VP of this club. I enjoy programming competitively and
						building projects in Python. If you are reading this you are now
						obliged to check CodeLink!
					</Box>
				</Flex>
			</Flex>

			{/* Social Equity Officer */}
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={ParthKapoor}
							/>
						</MotionBox>
					</Box>
				</div>
				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Social Equity Officer
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									{InstagramContact('https://www.instagram.com/parth25k')}
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Welcome to the club! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Parth Kapoor
						</Box>
						. I am the social equity officer for this club with some skills in
						Python. Feel free to talk to me about diversity and inclusion! I am
						aspiring to reach great heights in business. Also, I am an avid
						cricket fan and love to play it in my free time. If you're like me,
						check out Cricket Club!
					</Box>
				</Flex>
			</Flex>
		</Container>
	);
}

export function AboutDev() {
	return (
		<Container maxW='7xl' p='12'>
			{/* About Us */}
			<SlideFade in={true} offsetY='50vh'>
				<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
					<Heading
						fontWeight={600}
						fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
						lineHeight={'110%'}
						textAlign='center'
						mb={10}
					>
						<Box
							as={'span'}
							color={'blue.400'}
							bgGradient='linear(to-r, blue.200, purple.500)'
							bgClip='text'
						>
							The Development Team
						</Box>
					</Heading>
				</motion.div>
			</SlideFade>

			{/* Directors */}
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={VanshSuri}
							/>
						</MotionBox>
					</Box>
				</div>

				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Director of Development
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>
								<Box as='span' display={'flex'} pt={5}>
									<Box pr={5}>
										{InstagramContact('https://www.instagram.com/vanshsuri08')}
									</Box>{' '}
									<Box>
										{LinkedInContact(
											'https://www.linkedin.com/in/vansh-suri-b7a2582a9/'
										)}
									</Box>
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left'>
						Hi! My name{' '}
						<Box as='strong' fontWeight='600'>
							Vansh Suri{' '}
						</Box>
						and I&apos;m the Director of Development at HB CyberTech. I&apos;m
						passionate about programming and technology, with expertise in Java,
						Python, and more. Over the years, I&apos;ve worked on complex
						projects in software development and cybersecurity. At HB CyberTech,
						I lead a team driving innovation and building cutting-edge digital
						security solutions.
					</Box>
					<Box
						as='h2'
						fontSize='xl'
						fontWeight='400'
						mt={5}
						pb={10}
						textAlign='left'
					>
						Outside of work, I stay active in the tech community, exploring new
						technologies and contributing to open-source projects. Check out HB
						CyberTech to learn more about our mission and work!
					</Box>
				</Flex>
			</Flex>
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={''}
							/>
						</MotionBox>
					</Box>
				</div>

				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Director of Development
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									{InstagramContact('https://www.instagram.com/_meharkapoor/')}
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Hi! My name{' '}
						<Box as='strong' fontWeight='600'>
							Mehar Kapoor
						</Box>
						!
					</Box>
				</Flex>
			</Flex>

			{/* Development Team */}
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={IshaanDhillon}
							/>
						</MotionBox>
					</Box>
				</div>
				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Executive of Development
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									{InstagramContact(
										'https://www.instagram.com/ishaandhillon12'
									)}
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Hey! My name&apos;s{' '}
						<Box as='strong' fontWeight='600'>
							Ishaan Dhillon
						</Box>
						. I am a grade 11 student with a passion for coding. I&apos;ve
						gained experience in Python, Java, and C++, and I enjoy
						collaborating on projects that challenge my problem-solving skills.
						As an executive member, I aim to help foster a supportive
						environment where everyone can develop their coding abilities and
						explore new technologies.
					</Box>
				</Flex>
			</Flex>
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={''}
							/>
						</MotionBox>
					</Box>
				</div>
				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Executive of Development
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									{InstagramContact('https://www.instagram.com/m2rlonnn')}
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Hello! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Marlon Dawkins
						</Box>
						!
					</Box>
				</Flex>
			</Flex>
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={''}
							/>
						</MotionBox>
					</Box>
				</div>
				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Executive of Development
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									{InstagramContact('https://www.instagram.com/haaziq_dalvi')}
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Hi, my name is{' '}
						<Box as='strong' fontWeight='600'>
							Haaziq Dalvi
						</Box>
						!
					</Box>
				</Flex>
			</Flex>
		</Container>
	);
}

export function AboutMarketing() {
	return (
		<Container maxW='7xl' p='12'>
			{/* About Us */}
			<SlideFade in={true} offsetY='50vh'>
				<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
					<Heading
						fontWeight={600}
						fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
						lineHeight={'110%'}
						textAlign='center'
						mb={10}
					>
						<Box
							as={'span'}
							color={'blue.400'}
							bgGradient='linear(to-r, blue.200, purple.500)'
							bgClip='text'
						>
							The Marketing Team
						</Box>
					</Heading>
				</motion.div>
			</SlideFade>

			{/* Directors */}
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={PrathamDave}
							/>
						</MotionBox>
					</Box>
				</div>

				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Director of Marketing
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									<Box>
										{InstagramContact('https://www.instagram.com/pratham.d_/')}
									</Box>
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Hello! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Pratham Dave{' '}
						</Box>
						and I am the Marketing Director of this club. I have a good
						understanding of languages such as Python, HTML, Javascript, and
						C++. I also have an interest in aviation, and business.
					</Box>
				</Flex>
			</Flex>
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={SharunArunanthy}
							/>
						</MotionBox>
					</Box>
				</div>

				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Director of Marketing
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									<Box pr={5}>
										{InstagramContact('https://www.instagram.com/sharu_n_23')}
									</Box>
									<Box>
										{LinkedInContact(
											'https://www.linkedin.com/in/sharun-arunanthy-9789881aa'
										)}
									</Box>
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Welcome! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Sharun Arunanthy
						</Box>
						! While my main programming language is Python, I also have a
						passion for creating eye-catching designs on Canva to help our club
						stand out and connect with the tech community.
					</Box>
				</Flex>
			</Flex>

			{/* Marketing Team */}
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={KeyaShah}
							/>
						</MotionBox>
					</Box>
				</div>
				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Executive of Marketing
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>
								<Box as='span' display={'flex'} pt={5}>
									<Box pr={5}>
										{InstagramContact('https://www.instagram.com/keya_.shah')}
									</Box>
									<Box>
										{LinkedInContact(
											'https://www.linkedin.com/in/keya-shah-6099a629b/'
										)}
									</Box>
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Hello, my name is{' '}
						<Box as='strong' fontWeight='600'>
							Keya Shah
						</Box>
						, and I am excited to serve as a Marketing Executive at HB
						CyberTech. With a strong passion for cybersecurity and its growing
						importance in technology, I am thrilled to contribute to this team.
						I also have a keen interest in graphic design and look forward to
						collaborating with my team to create compelling promotional content
						that advances HB CyberTech&apos;s mission.
					</Box>
				</Flex>
			</Flex>
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={''}
							/>
						</MotionBox>
					</Box>
				</div>
				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Executive of Marketing
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={20}>
						Hello! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Jaithra Salem Chandrasekharan
						</Box>
						!
					</Box>
				</Flex>
			</Flex>
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={''}
							/>
						</MotionBox>
					</Box>
				</div>
				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Executive of Marketing
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									{InstagramContact('https://www.instagram.com/jusleen_j/')}
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Hi, my name is{' '}
						<Box as='strong' fontWeight='600'>
							Jusleen Jhandi
						</Box>
						!
					</Box>
				</Flex>
			</Flex>
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={''}
							/>
						</MotionBox>
					</Box>
				</div>
				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Executive of Marketing
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									{InstagramContact('https://www.instagram.com/kushikallam/')}
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Welcome! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Kushi Kallam
						</Box>
						.
					</Box>
				</Flex>
			</Flex>
		</Container>
	);
}

export function AboutEvents() {
	return (
		<Container maxW='7xl' p='12'>
			{/* About Us */}
			<SlideFade in={true} offsetY='50vh'>
				<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
					<Heading
						fontWeight={600}
						fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
						lineHeight={'110%'}
						textAlign='center'
						mb={10}
					>
						<Box
							as={'span'}
							color={'blue.400'}
							bgGradient='linear(to-r, blue.200, purple.500)'
							bgClip='text'
						>
							The Events Team
						</Box>
					</Heading>
				</motion.div>
			</SlideFade>

			{/* Director */}
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={NimayDesai}
							/>
						</MotionBox>
					</Box>
				</div>

				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Director of Events
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									<Box pr={5}>
										{GitHubContact('https://github.com/NimayDesai')}
									</Box>
									<Box>
										{InstagramContact('https://www.instagram.com/paladinaoe2')}
									</Box>
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Hello! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Nimay Desai
						</Box>
						, and I am the event director of this club. I am a full stack
						developer, but specialize in high-level langauges like JavaScript
						and Python. I also adore history and grand strategy video games. If
						you do too, check our History Club!
					</Box>
				</Flex>
			</Flex>

			{/* Events Team */}
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={GurvirSandhu}
							/>
						</MotionBox>
					</Box>
				</div>
				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Events Coordinator
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									{InstagramContact('https://www.instagram.com/gru_clues/')}
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Hey! My name&apos;s{' '}
						<Box as='strong' fontWeight='600'>
							Gurvir Sandhu{' '}
						</Box>
						and I will be the Event Coordinator of this club. I love to play
						racket sports and building circuits on different cad platforms. I am
						also a part of a table tennis club that I started and managed. Feel
						free to check it out!
					</Box>
				</Flex>
			</Flex>
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={VihaanShah}
							/>
						</MotionBox>
					</Box>
				</div>
				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Executive of Events
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									<Box pr={5}>
										{InstagramContact('https://www.instagram.com/v1haans/')}
									</Box>
									{LinkedInContact(
										'https://www.linkedin.com/in/vihaan-shah-305550266/'
									)}
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Hello! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Vihaan Shah
						</Box>
						, and I'm the Executive of Marketing of CyberTech. I specialize
						mainly in Python coding, but also have an affinity for robotics and
						engineering. Outside of computers, I enjoy sports and writing. If
						you want to learn more about coding and security, make sure to check
						out HB CyberTech!
					</Box>
				</Flex>
			</Flex>
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={DhruvParikh}
							/>
						</MotionBox>
					</Box>
				</div>
				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Executive of Events
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									{InstagramContact('https://www.instagram.com/dhruvpar1707')}
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Hi, my name is{' '}
						<Box as='strong' fontWeight='600'>
							Dhruv Parikh{' '}
						</Box>
						and I help arrange events in HB CyberTech club. I am very passionate
						about coding and have been learning Python and Java for over 3
						years. I'm also very passionate about Physics and Accounting.
					</Box>
				</Flex>
			</Flex>
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={DhyeyHansoti}
							/>
						</MotionBox>
					</Box>
				</div>
				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Executive of Events
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>
								<Box as='span' display={'flex'} pt={5}>
									{InstagramContact('https://www.instagram.com/ledoorframe')}
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						My name is{' '}
						<Box as='strong' fontWeight='600'>
							Dhyey Hansoti
						</Box>
						!
					</Box>
				</Flex>
			</Flex>
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								loading='lazy'
								src={''}
							/>
						</MotionBox>
					</Box>
				</div>
				<Flex
					position='relative'
					ml={['auto', 'auto', 16]}
					m={['auto', 'initial']}
					w={['90%', '85%', '80%']}
					maxW='800px'
					justifyContent='center'
					direction='column'
				>
					<Box position='relative'>
						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='fit-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Executive of Events
									<Box
										as='span'
										display='block'
										position='absolute'
										bg='blue.400'
										w='100%'
										h='1px'
										bottom={-2}
									/>
								</Box>{' '}
								<Box as='span' display={'flex'} pt={5}>
									{InstagramContact('https://www.instagram.com/himothy_aa')}
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
						Hello! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Arnav Ahuja
						</Box>
						!
					</Box>
				</Flex>
			</Flex>
		</Container>
	);
}

// export default function About() {
// 	return (
// 		<Container maxW='7xl' p='12'>
// 			{/* About Us */}
// 			<SlideFade in={true} offsetY='50vh'>
// 				<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
// 					<Heading
// 						fontWeight={600}
// 						fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
// 						lineHeight={'110%'}
// 						textAlign='center'
// 						mb={10}
// 					>
// 						<Box
// 							as={'span'}
// 							color={'blue.400'}
// 							bgGradient='linear(to-r, blue.200, purple.500)'
// 							bgClip='text'
// 						>
// 							About Us
// 						</Box>
// 					</Heading>
// 				</motion.div>
// 			</SlideFade>

// 			{/* Executive Team */}

// 			{/* President */}
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src='https://avatars.githubusercontent.com/u/61165141?v=4'
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>

// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									President
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>
// 								<Box as='span' display={'flex'} pt={5}>
// 									<Box pr={5}>
// 										{GitHubContact('https://github.com/sachkeeratb')}
// 									</Box>
// 									<Box pr={5}>
// 										{InstagramContact('https://www.instagram.com/sachkeeratb')}
// 									</Box>
// 									{LinkedInContact(
// 										'https://www.linkedin.com/in/sachkeeratbrar'
// 									)}
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left'>
// 						Hello! My name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Sachkeerat Singh Brar
// 						</Box>{' '}
// 						and I&apos;m the president of this club. I am a Full Stack
// 						Developer, but I also have an affinity for the lower levels of
// 						programming. In my free time, I like to read, study, and play video
// 						games, especially mass-multiplayer FPSs.
// 					</Box>
// 					<Box
// 						as='h2'
// 						fontSize='xl'
// 						fontWeight='400'
// 						mt={5}
// 						pb={10}
// 						textAlign='left'
// 					>
// 						I hope you enjoy learning and creating in this space. Happy coding!
// 					</Box>
// 				</Flex>
// 			</Flex>

// 			{/* Vice Presidents */}
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={UdeshwarSinghSandhu}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>

// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Vice President
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									<Box>
// 										{InstagramContact(
// 											'https://www.instagram.com/udesh_awesome'
// 										)}
// 									</Box>
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Hi! My name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Udeshwar Singh Sandhu{' '}
// 						</Box>
// 						and I am a VP of HB Cybertech. I have a strong passion for
// 						programming and enjoy innovative technology. If you are want more
// 						info about cyber security and cool technology, check out HB
// 						CyberTech.
// 					</Box>
// 				</Flex>
// 			</Flex>
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={EdwardLin}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>

// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Vice President
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									<Box pr={5}>
// 										{GitHubContact('https://github.com/TheNobleCoder')}
// 									</Box>
// 									<Box>
// 										{InstagramContact('https://www.instagram.com/edyi_01')}
// 									</Box>
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Greetings! My name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Edward Lin{' '}
// 						</Box>
// 						and I am the VP of this club. I enjoy programming competitively and
// 						building projects in Python. If you are reading this you are now
// 						obliged to check CodeLink!
// 					</Box>
// 				</Flex>
// 			</Flex>

// 			{/* Social Equity Officer */}
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={ParthKapoor}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>
// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Social Equity Officer
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									{InstagramContact('https://www.instagram.com/parth25k')}
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Welcome to the club! My name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Parth Kapoor
// 						</Box>
// 						. I am the social equity officer for this club with some skills in
// 						Python. Feel free to talk to me about diversity and inclusion! I am
// 						aspiring to reach great heights in business. Also, I am an avid
// 						cricket fan and love to play it in my free time. If you're like me,
// 						check out Cricket Club!
// 					</Box>
// 				</Flex>
// 			</Flex>

// 			{/* Directors */}
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={VanshSuri}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>

// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Director of Development
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>
// 								<Box as='span' display={'flex'} pt={5}>
// 									<Box pr={5}>
// 										{InstagramContact('https://www.instagram.com/vanshsuri08')}
// 									</Box>
// 									<Box>
// 										{LinkedInContact(
// 											'https://www.linkedin.com/in/vansh-suri-b7a2582a9/'
// 										)}
// 									</Box>
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left'>
// 						Hi! My name{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Vansh Suri{' '}
// 						</Box>
// 						and I&apos;m the Director of Development at HB CyberTech. I&apos;m
// 						passionate about programming and technology, with expertise in Java,
// 						Python, and more. Over the years, I&apos;ve worked on complex
// 						projects in software development and cybersecurity. At HB CyberTech,
// 						I lead a team driving innovation and building cutting-edge digital
// 						security solutions.
// 					</Box>
// 					<Box
// 						as='h2'
// 						fontSize='xl'
// 						fontWeight='400'
// 						mt={5}
// 						pb={10}
// 						textAlign='left'
// 					>
// 						Outside of work, I stay active in the tech community, exploring new
// 						technologies and contributing to open-source projects. Check out HB
// 						CyberTech to learn more about our mission and work!
// 					</Box>
// 				</Flex>
// 			</Flex>
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={''}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>

// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Director of Development
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									{InstagramContact('https://www.instagram.com/_meharkapoor/')}
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Hi! My name{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Mehar Kapoor
// 						</Box>
// 						!
// 					</Box>
// 				</Flex>
// 			</Flex>
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={NimayDesai}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>

// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Director of Events
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									<Box pr={5}>
// 										{GitHubContact('https://github.com/NimayDesai')}
// 									</Box>
// 									<Box>
// 										{InstagramContact('https://www.instagram.com/paladinaoe2')}
// 									</Box>
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Hello! My name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Nimay Desai
// 						</Box>
// 						, and I am the event director of this club. I am a full stack
// 						developer, but specialize in high-level langauges like JavaScript
// 						and Python. I also adore history and grand strategy video games. If
// 						you do too, check our History Club!
// 					</Box>
// 				</Flex>
// 			</Flex>
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={PrathamDave}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>

// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Director of Marketing
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									<Box>
// 										{InstagramContact('https://www.instagram.com/pratham.d_/')}
// 									</Box>
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Hello! My name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Pratham Dave{' '}
// 						</Box>
// 						and I am the Marketing Director of this club. I have a good
// 						understanding of languages such as Python, HTML, Javascript, and
// 						C++. I also have an interest in aviation, and business.
// 					</Box>
// 				</Flex>
// 			</Flex>
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={SharunArunanthy}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>

// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Director of Marketing
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									<Box pr={5}>
// 										{InstagramContact('https://www.instagram.com/sharu_n_23')}
// 									</Box>
// 									<Box>
// 										{LinkedInContact(
// 											'https://www.linkedin.com/in/sharun-arunanthy-9789881aa'
// 										)}
// 									</Box>
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Welcome! My name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Sharun Arunanthy
// 						</Box>
// 						! While my main programming language is Python, I also have a
// 						passion for creating eye-catching designs on Canva to help our club
// 						stand out and connect with the tech community.
// 					</Box>
// 				</Flex>
// 			</Flex>

// 			{/* Development Team */}
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={IshaanDhillon}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>
// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Executive of Development
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									{InstagramContact(
// 										'https://www.instagram.com/ishaandhillon12'
// 									)}
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Hey! My name&apos;s{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Ishaan Dhillon{' '}
// 						</Box>
// 						. I am a grade 11 student with a passion for coding. I&apos;ve
// 						gained experience in Python, Java, and C++, and I enjoy
// 						collaborating on projects that challenge my problem-solving skills.
// 						As an executive member, I aim to help foster a supportive
// 						environment where everyone can develop their coding abilities and
// 						explore new technologies.
// 					</Box>
// 				</Flex>
// 			</Flex>
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={''}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>
// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Executive of Development
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									{InstagramContact('https://www.instagram.com/m2rlonnn')}
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Hello! My name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Marlon Dawkins
// 						</Box>
// 						!
// 					</Box>
// 				</Flex>
// 			</Flex>
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={''}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>
// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Executive of Development
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									{InstagramContact('https://www.instagram.com/haaziq_dalvi')}
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Hi, my name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Haaziq Dalvi{' '}
// 						</Box>
// 						!
// 					</Box>
// 				</Flex>
// 			</Flex>

// 			{/* Marketing Team */}
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={KeyaShah}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>
// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Executive of Marketing
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>
// 								<Box as='span' display={'flex'} pt={5}>
// 									<Box pr={5}>
// 										{InstagramContact('https://www.instagram.com/keya_.shah')}
// 									</Box>
// 									<Box>
// 										{LinkedInContact(
// 											'https://www.linkedin.com/in/keya-shah-6099a629b/'
// 										)}
// 									</Box>
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Hello, my name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Keya Shah
// 						</Box>
// 						, and I am excited to serve as a Marketing Executive at HB
// 						CyberTech. With a strong passion for cybersecurity and its growing
// 						importance in technology, I am thrilled to contribute to this team.
// 						I also have a keen interest in graphic design and look forward to
// 						collaborating with my team to create compelling promotional content
// 						that advances HB CyberTech&apos;s mission.
// 					</Box>
// 				</Flex>
// 			</Flex>
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={''}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>
// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Executive of Marketing
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Hello! My name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Jaithra Salem Chandrasekharan
// 						</Box>
// 						, and I'm the Executive of Marketing of CyberTech. I specialize
// 						mainly in Python coding, but also have an affinity for robotics and
// 						engineering. Outside of computers, I enjoy sports and writing. If
// 						you want to learn more about coding and security, make sure to check
// 						out HB CyberTech!
// 					</Box>
// 				</Flex>
// 			</Flex>
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={''}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>
// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Executive of Marketing
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									{InstagramContact('https://www.instagram.com/jusleen_j/')}
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Hi, my name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Jusleen Jhandi
// 						</Box>
// 						!
// 					</Box>
// 				</Flex>
// 			</Flex>
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={''}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>
// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Executive of Marketing
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									{InstagramContact('https://www.instagram.com/kushikallam/')}
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Hi, my name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Kushi Kallam
// 						</Box>
// 						!
// 					</Box>
// 				</Flex>
// 			</Flex>

// 			{/* Events Team */}
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={GurvirSandhu}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>
// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Events Coordinator
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									{InstagramContact('https://www.instagram.com/gru_clues/')}
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Hey! My name&apos;s{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Gurvir Sandhu{' '}
// 						</Box>
// 						and I will be the Event Coordinator of this club. I love to play
// 						racket sports and building circuits on different cad platforms. I am
// 						also a part of a table tennis club that I started and managed. Feel
// 						free to check it out!
// 					</Box>
// 				</Flex>
// 			</Flex>
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={VihaanShah}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>
// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Executive of Events
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									<Box pr={5}>
// 										{InstagramContact('https://www.instagram.com/v1haans/')}
// 									</Box>
// 									{LinkedInContact(
// 										'https://www.linkedin.com/in/vihaan-shah-305550266/'
// 									)}
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Hello! My name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Vihaan Shah
// 						</Box>
// 						, and I'm the Executive of Marketing of CyberTech. I specialize
// 						mainly in Python coding, but also have an affinity for robotics and
// 						engineering. Outside of computers, I enjoy sports and writing. If
// 						you want to learn more about coding and security, make sure to check
// 						out HB CyberTech!
// 					</Box>
// 				</Flex>
// 			</Flex>
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={DhruvParikh}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>
// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Executive of Events
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									{InstagramContact('https://www.instagram.com/dhruvpar1707')}
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Hi, my name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Dhruv Parikh{' '}
// 						</Box>
// 						and I help arrange events in HB CyberTech club. I am very passionate
// 						about coding and have been learning Python and Java for over 3
// 						years. I'm also very passionate about Physics and Accounting.
// 					</Box>
// 				</Flex>
// 			</Flex>
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={''}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>
// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Executive of Events
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									{InstagramContact('https://www.instagram.com/ledoorframe')}
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						My name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Dhyey Hanosati
// 						</Box>
// 						!
// 					</Box>
// 				</Flex>
// 			</Flex>
// 			<Flex direction={['column', 'column', 'row']}>
// 				<div>
// 					<Box m='auto' mb={[16, 16, 'auto']}>
// 						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
// 							<Avatar
// 								size='2xl'
// 								showBorder={true}
// 								borderColor='blue.400'
// 								loading='lazy'
// 								src={''}
// 							/>
// 						</MotionBox>
// 					</Box>
// 				</div>
// 				<Flex
// 					position='relative'
// 					ml={['auto', 'auto', 16]}
// 					m={['auto', 'initial']}
// 					w={['90%', '85%', '80%']}
// 					maxW='800px'
// 					justifyContent='center'
// 					direction='column'
// 				>
// 					<Box position='relative'>
// 						<MotionBox whileHover={{ translateY: -5 }} width='fit-content'>
// 							<Box
// 								as='h1'
// 								mb={6}
// 								fontSize='3xl'
// 								lineHeight='shorter'
// 								fontWeight='bold'
// 								mt={0}
// 								cursor='pointer'
// 								width='fit-content'
// 								textAlign='left'
// 							>
// 								<Box as='span' display='inline-block' position='relative'>
// 									Executive of Events
// 									<Box
// 										as='span'
// 										display='block'
// 										position='absolute'
// 										bg='blue.400'
// 										w='100%'
// 										h='1px'
// 										bottom={-2}
// 									/>
// 								</Box>{' '}
// 								<Box as='span' display={'flex'} pt={5}>
// 									{InstagramContact('https://www.instagram.com/himothy_aa')}
// 								</Box>
// 							</Box>
// 						</MotionBox>
// 					</Box>
// 					<Box as='h2' fontSize='xl' fontWeight='400' textAlign='left' pb={10}>
// 						Hello! My name is{' '}
// 						<Box as='strong' fontWeight='600'>
// 							Arnav Ahuja
// 						</Box>
// 						!
// 					</Box>
// 				</Flex>
// 			</Flex>
// 		</Container>
// 	);
// }
