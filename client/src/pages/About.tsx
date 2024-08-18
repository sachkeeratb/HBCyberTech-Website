import {
	Flex,
	Avatar,
	Box,
	Container,
	forwardRef,
	Link
} from '@chakra-ui/react';
// Here we have used framer-motion package for animations
import { motion, isValidMotionProp } from 'framer-motion';
import ParthKapoor from '../assets/ParthKapoor.png';

const About = () => {
	return (
		<Container maxW='7xl' p='12'>
			<Flex direction={['column', 'column', 'row']}>
				<Link href='https://github.com/sachkeeratb' isExternal>
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
				</Link>
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
									The President
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
					<Box as='h2' fontSize='2xl' fontWeight='400' textAlign='left'>
						Hello! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Sachkeerat Singh Brar
						</Box>{' '}
						and I&apos;m the president of this club. I am a Full Stack
						Developer, but I also have an affinity for the lower levels of
						computers. In my free time, I like to read, study, and play video
						games. If you like grand strategy games, check out History Club!
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

			<Flex direction={['column', 'column', 'row']}>
				<Link href='https://www.instagram.com/parth25k' isExternal>
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
				</Link>
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
								// mt={10}
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
								</Box>
							</Box>
						</MotionBox>
					</Box>
					<Box as='h2' fontSize='2xl' fontWeight='400' textAlign='left'>
						Welcome to the club! My name is{' '}
						<Box as='strong' fontWeight='600'>
							Parth Kapoor
						</Box>{' '}
						. I am aspiring to reach great heights in business. Also, I am an
						avid cricket fan and love to play it in my free time. If you're like
						me, check out Cricket Club!
					</Box>
				</Flex>
			</Flex>
		</Container>
	);
};

export const MotionBox = motion(
	forwardRef((props, ref) => {
		const chakraProps = Object.fromEntries(
			Object.entries(props).filter(([key]) => !isValidMotionProp(key))
		);
		return <Box ref={ref} {...chakraProps} />;
	})
);

export default About;
