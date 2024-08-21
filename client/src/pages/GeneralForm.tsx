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
import { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

interface FormVals {
	fullName: string;
	email: string;
	skills: number;
	extra: string;
}

interface FormErrors {
	nameErr: boolean;
	emailErr: boolean;
	extraErr: boolean;
}

interface Slider {
	value: number;
	showTooltip: boolean;
}

export default function GeneralForm() {
	const instance = axios.create({
		baseURL: 'http://localhost:8080',
		timeout: 1000,
		withCredentials: false,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': '*',
			'Access-Control-Allow-Headers': '*'
		}
	});

	const labelStyles = {
		mt: '2',
		ml: '-2.5',
		fontSize: 'sm'
	};
	const formBG = useColorModeValue('white', 'gray.700');

	const [data, setData] = useState<FormVals>({
		fullName: '',
		email: '',
		skills: 50,
		extra: ''
	});
	const [error, setError] = useState<FormErrors>({
		nameErr: false,
		emailErr: false,
		extraErr: false
	});
	const [extrInpChars, setExtrInpChars] = useState(350);
	const [slider, setSlider] = useState<Slider>({
		value: 50,
		showTooltip: false
	});

	const handleNameInputChange = (e: { target: { value: string } }) => {
		setData({ ...data, fullName: e.target.value });
		validateName(e.target.value);
	};

	const handleEmailInputChange = (e: { target: { value: string } }) => {
		setData({ ...data, email: e.target.value });
		validateEmail(e.target.value);
	};

	const handleExtraInputChange = (e: { target: { value: string } }) => {
		setData({ ...data, extra: e.target.value });
		setExtrInpChars(350 - e.target.value.length);
		validateExtra(350 - e.target.value.length);
	};

	const validateName = (val: string) => {
		if (
			val === '' ||
			val.length < 2 ||
			val.length > 40 ||
			!/^[A-Za-zÀ-ÖØ-öø-įĴ-őŔ-žǍ-ǰǴ-ǵǸ-țȞ-ȟȤ-ȳɃɆ-ɏḀ-ẞƀ-ƓƗ-ƚƝ-ơƤ-ƥƫ-ưƲ-ƶẠ-ỿ\s']*$/u.test(
				val
			)
		)
			setError({ ...error, nameErr: true });
		else setError({ ...error, nameErr: false });
	};

	const validateEmail = (val: string) => {
		if (
			!val.endsWith('@pdsb.net') ||
			val.length < 15 ||
			val.length > 20 ||
			!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)
		)
			setError({ ...error, emailErr: true });
		else setError({ ...error, emailErr: false });
	};

	const validateExtra = (val: number) => {
		if (val <= 0 || val > 350) setError({ ...error, extraErr: true });
		else setError({ ...error, extraErr: false });
	};

	function canSubmit(): boolean {
		return !(error.nameErr || error.emailErr || error.extraErr);
	}

	const isDuplicate = async (fullName: string, email: string) => {
		const recievedFullName = await instance.get(
			`/general_member/get/${fullName}`
		);
		const recievedEmail = await instance.get(`/general_member/get/${email}`);

		if (recievedFullName.data.length <= 0 && recievedEmail.data.length <= 0)
			return false;

		toast.error('You have already signed up.');
		return true;
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!canSubmit()) {
			toast.error('You have invalid inputs. Please try again.');
			console.log(data);
			return;
		}

		const { fullName, email, skills, extra } = data;

		try {
			if (await isDuplicate(fullName, email)) return;

			const { data } = await instance.post('/general_member/post', {
				full_name: fullName,
				email: email,
				skills: skills,
				extra: extra,
				date_created: new Date().toISOString()
			});

			// Show the user if any input is invalid
			if (data.error) {
				toast.error(data.error);
				throw new Error(data.error);
			}

			// Allow the user to continue
			setData({} as FormVals);
			toast.success('Registration successful. Welcome.');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container maxW='7xl' py={10} px={{ base: 5, md: 8 }}>
			<Toaster
				position='bottom-right'
				reverseOrder={false}
				toastOptions={{
					style: {
						color: useColorModeValue('black', 'white'),
						background: useColorModeValue('#F2F3F4', '#181818')
					}
				}}
			/>
			<Stack spacing={10}>
				<Flex align='center' justifyContent='center' direction='column'>
					<Heading fontSize='4xl' mb={2}>
						General Member Form
					</Heading>
					<Text fontSize='md' textAlign='center' mb={1}>
						Register now to be a general member of HB CyberTech! Be prepared for
						amazing experiences and opportunities!
					</Text>
					<Text fontSize='md' textAlign='center'>
						Don't worry if you have no prior knowledge. We welcome members of
						all skill levels and provide resources and support to help you learn
						and grow!!
					</Text>
				</Flex>
				<Divider />
				<form onSubmit={handleSubmit}>
					<VStack
						spacing={8}
						w='100%'
						bg={formBG}
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
								<FormControl isRequired isInvalid={error.nameErr}>
									<FormLabel>Full Name</FormLabel>
									<Input
										type='name'
										placeholder='Sachkeerat Singh Brar'
										value={data.fullName}
										onChange={handleNameInputChange}
									/>
									{!error.nameErr ? (
										<></>
									) : data.fullName === '' ? (
										<FormErrorMessage>A name cannot be empty</FormErrorMessage>
									) : data.fullName.length < 2 || data.fullName.length > 40 ? (
										<FormErrorMessage>
											Invalid length. Must be between 2-40.
										</FormErrorMessage>
									) : !/^[a-zA-Z\s]*$/.test(data.fullName) ? (
										<FormErrorMessage>Invalid characters.</FormErrorMessage>
									) : (
										<></>
									)}
								</FormControl>
								<FormControl isRequired isInvalid={error.emailErr}>
									<FormLabel>Email</FormLabel>
									<Input
										type='email'
										placeholder='123456@pdsb.net'
										value={data.email}
										onChange={handleEmailInputChange}
									/>
									{!error.emailErr ? (
										<></>
									) : (
										<FormErrorMessage>
											A valid PDSB email is required.
										</FormErrorMessage>
									)}
								</FormControl>
							</Stack>
							<FormControl isRequired>
								<FormLabel>
									Skills In CyberSecurity or Low Level Programming
								</FormLabel>
							</FormControl>
							<Slider
								id='slider'
								defaultValue={50}
								min={0}
								max={100}
								colorScheme='blue'
								onChange={(v) => {
									setSlider({ ...slider, value: v });
									setData({ ...data, skills: v });
								}}
								onMouseEnter={() => {
									setSlider({ ...slider, showTooltip: true });
								}}
								onMouseLeave={() => {
									setSlider({ ...slider, showTooltip: false });
								}}
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
									isOpen={slider.showTooltip}
									label={
										slider.value <= 25
											? `${slider.value}%. Don't worry!`
											: slider.value >= 75
											? `${slider.value}%. You're a pro!`
											: `${slider.value}%`
									}
								>
									<SliderThumb />
								</Tooltip>
							</Slider>
							<FormControl id='message' pt={4} isInvalid={error.extraErr}>
								<FormLabel>Additional Information</FormLabel>
								<Textarea
									size='lg'
									placeholder='Enter your (optional) message'
									rounded='md'
									value={data.extra}
									onChange={handleExtraInputChange}
								/>
								{extrInpChars > 0 ? (
									<></>
								) : (
									<FormErrorMessage>
										You are only allowed to input 350 characters.
									</FormErrorMessage>
								)}
								{extrInpChars > 50 ? (
									<Text fontSize='sm' textAlign={'right'}>
										{extrInpChars}
									</Text>
								) : (
									<Text fontSize='sm' textAlign={'right'} color={'red'}>
										{extrInpChars}
									</Text>
								)}
							</FormControl>
						</VStack>
						<VStack w='100%'>
							<Button
								type='submit'
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
				</form>
			</Stack>
		</Container>
	);
}
