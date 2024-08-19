import {
	Container,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	Textarea,
	Stack,
	Button,
	Heading,
	useColorModeValue,
	VStack,
	Flex,
	Text,
	Divider,
	Slider,
	SliderFilledTrack,
	SliderMark,
	SliderThumb,
	SliderTrack,
	Tooltip
} from '@chakra-ui/react';
import { SetStateAction, useState } from 'react';

function NameInput(
	input: string,
	setInput: React.Dispatch<React.SetStateAction<string>>
) {
	const handleInputChange = (e: {
		target: { value: SetStateAction<string> };
	}) => setInput(e.target.value);

	const emptyErr = input === '';
	const lengthErr = input.length < 2 || input.length > 50;
	const charErr = !/^[a-zA-Z\s]*$/.test(input);
	const isErr = emptyErr || lengthErr || charErr;

	return (
		<FormControl isRequired isInvalid={isErr}>
			<FormLabel>Full Name</FormLabel>
			<Input
				type='name'
				placeholder='Sachkeerat Singh Brar'
				value={input}
				onChange={handleInputChange}
			/>
			{!isErr ? (
				<></>
			) : emptyErr ? (
				<FormErrorMessage>A name cannot be empty</FormErrorMessage>
			) : lengthErr ? (
				<FormErrorMessage>
					Invalid length. Must be between 2-30.{' '}
				</FormErrorMessage>
			) : charErr ? (
				<FormErrorMessage>Invalid characters.</FormErrorMessage>
			) : (
				<></>
			)}
		</FormControl>
	);
}

function EmailInput(
	input: string,
	setInput: React.Dispatch<React.SetStateAction<string>>
) {
	const handleInputChange = (e: {
		target: { value: SetStateAction<string> };
	}) => setInput(e.target.value);

	const isErr =
		input === '' ||
		!input.endsWith('@pdsb.net') ||
		input.length < 15 ||
		input.length > 20;

	return (
		<FormControl isRequired isInvalid={isErr}>
			<FormLabel>Email</FormLabel>
			<Input
				type='email'
				placeholder='123456@pdsb.net'
				value={input}
				onChange={handleInputChange}
			/>
			{!isErr ? (
				<></>
			) : (
				<FormErrorMessage>A valid PDSB email is required.</FormErrorMessage>
			)}
		</FormControl>
	);
}

function SliderWithMarker(
	input: number,
	setInput: React.Dispatch<React.SetStateAction<number>>
) {
	const [showTooltip, setShowTooltip] = useState(false);
	const labelStyles = {
		mt: '2',
		ml: '-2.5',
		fontSize: 'sm'
	};
	return (
		<>
			<FormControl isRequired>
				<FormLabel>Skills In CyberSecurity or Low Level Programming</FormLabel>
			</FormControl>
			<Slider
				id='slider'
				defaultValue={50}
				min={0}
				max={100}
				colorScheme='blue'
				onChange={(v) => setInput(v)}
				onMouseEnter={() => setShowTooltip(true)}
				onMouseLeave={() => setShowTooltip(false)}
			>
				<SliderMark value={25} {...labelStyles}>
					25%
				</SliderMark>
				<SliderMark value={50} {...labelStyles}>
					50%
				</SliderMark>
				<SliderMark value={75} {...labelStyles}>
					75%
				</SliderMark>
				<SliderTrack>
					<SliderFilledTrack />
				</SliderTrack>
				<Tooltip
					hasArrow
					bg='teal.500'
					color='white'
					placement='top'
					isOpen={showTooltip}
					label={
						input <= 25
							? `${input}%. Don't worry!`
							: input >= 75
							? `${input}%. You're a pro!`
							: `${input}%`
					}
				>
					<SliderThumb />
				</Tooltip>
			</Slider>
		</>
	);
}
export default function GeneralForm() {
	const [nameInput, setNameInput] = useState('');
	const [emailInput, setEmailInput] = useState('');
	const [sliderVal, setSliderVal] = useState(50);

	return (
		<Container maxW='7xl' py={10} px={{ base: 5, md: 8 }}>
			<Stack spacing={10}>
				<Flex align='center' justifyContent='center' direction='column'>
					<Heading fontSize='4xl' mb={2}>
						General Member Form
					</Heading>
					<Text fontSize='md' textAlign='center'>
						Register now to be a general member of HB CyberTech! Be prepared for
						amazing experiences and opportunities!
					</Text>
				</Flex>
				<Divider />
				<VStack
					as='form'
					spacing={8}
					w='100%'
					bg={useColorModeValue('white', 'gray.700')}
					rounded='lg'
					boxShadow='lg'
					p={{ base: 5, sm: 10 }}
				>
					<VStack spacing={4} w='100%'>
						<Stack
							w='100%'
							spacing={3}
							direction={{ base: 'column', md: 'row' }}
						>
							{NameInput(nameInput, setNameInput)}
							{EmailInput(emailInput, setEmailInput)}
						</Stack>
						{SliderWithMarker(sliderVal, setSliderVal)}
						<FormControl id='message' pt={4}>
							<FormLabel>Additional Information</FormLabel>
							<Textarea
								size='lg'
								placeholder='Enter your (optional) message'
								rounded='md'
							/>
						</FormControl>
					</VStack>
					<VStack w='100%'>
						<Button
							bg='teal.300'
							_hover={{
								bg: 'teal.500'
							}}
							rounded='md'
							w={{ base: '100%', md: 'max-content' }}
						>
							Submit Form
						</Button>
					</VStack>
				</VStack>
			</Stack>
		</Container>
	);
}
