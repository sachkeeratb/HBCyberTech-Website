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

import { motion, isValidMotionProp } from 'framer-motion';

// Import images
import ParthKapoor from '../assets/ParthKapoor.png';
import GurvirSandhu from '../assets/GurvirSandhu.png';
import UdeshwarSinghSandhu from '../assets/UdeshwarSinghSandhu.png';
import PrathamDave from '../assets/PrathamDave.jpg';
import VanshSuri from '../assets/VanshSuri.png';
import EdwardLin from '../assets/EdwardLin.jpg';
import PranavThukral from '../assets/PranavThukral.jpg';

// Import icons
import {
	FaGithub as GitHubIcon,
	FaInstagram as InstagramIcon,
	FaLinkedin as LinkedInIcon
} from 'react-icons/fa';

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

export default function About() {
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
							About Us
						</Box>
					</Heading>
				</motion.div>
			</SlideFade>

			{/* Executive Team */}

			{/* President */}
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
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
						<MotionBox whileHover={{ translateY: -5 }} width='max-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='max-content'
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
					<Box as='h2' fontSize='2xl' fontWeight='400' textAlign='left'>
						Hello! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Sachkeerat Singh Brar
						</Box>{' '}
						and I&apos;m the president of this club. I am a Full Stack
						Developer, but I also have an affinity for the lower levels of
						computers. In my free time, I like to read, study, and play video
						games, especially mass-multiplayer FPSs.
					</Box>
					<Box
						as='h2'
						fontSize='2xl'
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
						<MotionBox whileHover={{ translateY: -5 }} width='max-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='max-content'
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
					<Box as='h2' fontSize='2xl' fontWeight='400' textAlign='left' pb={10}>
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
						<MotionBox whileHover={{ translateY: -5 }} width='max-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='max-content'
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
					<Box as='h2' fontSize='2xl' fontWeight='400' textAlign='left' pb={10}>
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
						<MotionBox whileHover={{ translateY: -5 }} width='max-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='max-content'
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
					<Box as='h2' fontSize='2xl' fontWeight='400' textAlign='left' pb={10}>
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

			{/* Directors */}
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
								src={'https://avatars.githubusercontent.com/u/62720666?v=4'}
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
						<MotionBox whileHover={{ translateY: -5 }} width='max-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='max-content'
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
					<Box as='h2' fontSize='2xl' fontWeight='400' textAlign='left' pb={10}>
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
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
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
						<MotionBox whileHover={{ translateY: -5 }} width='max-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='max-content'
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
					<Box as='h2' fontSize='2xl' fontWeight='400' textAlign='left' pb={10}>
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
						<MotionBox whileHover={{ translateY: -5 }} width='max-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='max-content'
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
					<Box as='h2' fontSize='2xl' fontWeight='400' textAlign='left'>
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
						fontSize='2xl'
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

			{/* Other various executives */}
			<Flex direction={['column', 'column', 'row']}>
				<div>
					<Box m='auto' mb={[16, 16, 'auto']}>
						<MotionBox whileHover={{ scale: 1.2 }} rounded='full' shadow='lg'>
							<Avatar
								size='2xl'
								showBorder={true}
								borderColor='blue.400'
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
						<MotionBox whileHover={{ translateY: -5 }} width='max-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='max-content'
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
					<Box as='h2' fontSize='2xl' fontWeight='400' textAlign='left' pb={10}>
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
								src={PranavThukral}
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
						<MotionBox whileHover={{ translateY: -5 }} width='max-content'>
							<Box
								as='h1'
								mb={6}
								fontSize='3xl'
								lineHeight='shorter'
								fontWeight='bold'
								mt={0}
								cursor='pointer'
								width='max-content'
								textAlign='left'
							>
								<Box as='span' display='inline-block' position='relative'>
									Marketing Executive
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
										'https://www.instagram.com/pranav.thukral23'
									)}
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='2xl' fontWeight='400' textAlign='left' pb={10}>
						Hi! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Pranav
						</Box>
						, and I am a marketing exec for this club. I'm interested in
						cybersecurity as well as computers in general. I'm also president of
						our school's Hindu Student Association, Sanskar, so make sure to
						check that out!
					</Box>
				</Flex>
			</Flex>
		</Container>
	);
}
