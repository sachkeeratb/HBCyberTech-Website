// A form for the general public to sign up to be a general member of the club

// React and Chakra UI Components
import { useState } from 'react';
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
	Tooltip,
	Select
} from '@chakra-ui/react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

interface FormVals {
	fullName: string;
	email: string;
	grade: number;
	skills: number;
	extra: string;
}

interface FormErrors {
	nameErr: boolean;
	emailErr: boolean;
	gradeErr: boolean;
	extraErr: boolean;
}

interface Slider {
	value: number;
	showTooltip: boolean;
}

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

export default function GeneralForm() {
	// Store the styles
	const labelStyles = {
		mt: '2',
		ml: '-2.5',
		fontSize: 'sm'
	};
	const formBG = useColorModeValue('white', 'gray.700');

	// Store the form data, errors, and character count
	const [data, setData] = useState<FormVals>({
		fullName: '',
		email: '',
		grade: 0,
		skills: 50,
		extra: ''
	});
	const [error, setError] = useState<FormErrors>({
		nameErr: false,
		emailErr: false,
		gradeErr: false,
		extraErr: false
	});
	const [extrInpChars, setExtrInpChars] = useState(350);

	// Store the slider value and tooltip visibility
	const [slider, setSlider] = useState<Slider>({
		value: 50,
		showTooltip: false
	});

	const [loading, setLoading] = useState(false);

	// Handle input changes
	const handleNameInputChange = (e: { target: { value: string } }) => {
		setData({ ...data, fullName: e.target.value });
		setError({
			...error,
			nameErr:
				e.target.value === '' ||
				e.target.value.length < 2 ||
				e.target.value.length > 40 ||
				!/^[A-Za-zÀ-ÖØ-öø-įĴ-őŔ-žǍ-ǰǴ-ǵǸ-țȞ-ȟȤ-ȳɃɆ-ɏḀ-ẞƀ-ƓƗ-ƚƝ-ơƤ-ƥƫ-ưƲ-ƶẠ-ỿ\s']*$/u.test(
					e.target.value
				)
		});
	};
	const handleEmailInputChange = (e: { target: { value: string } }) => {
		setData({ ...data, email: e.target.value });

		let isEmailErr = true;
		if (
			/^[0-9]{7}@pdsb.net$/.test(e.target.value) &&
			e.target.value.charAt(0) === '1' &&
			parseInt(e.target.value.charAt(1)) <= 2
		)
			isEmailErr = false;
		else if (
			/^[0-9]{6}@pdsb.net$/.test(e.target.value) &&
			parseInt(e.target.value.charAt(0)) >= 6
		)
			isEmailErr = false;
		setError({
			...error,
			emailErr: isEmailErr
		});
	};
	const handleExtraInputChange = (e: { target: { value: string } }) => {
		setData({ ...data, extra: e.target.value });
		setExtrInpChars(350 - e.target.value.length);
		setError({
			...error,
			extraErr: e.target.value.length < 0 || e.target.value.length > 350
		});
	};

	// Check if the form can be submitted
	function canSubmit(): boolean {
		return !(
			error.nameErr ||
			error.emailErr ||
			error.extraErr ||
			error.gradeErr
		);
	}

	// Check if the user has already signed up
	const isDuplicate = async (
		fullName: string,
		email: string
	): Promise<boolean> => {
		const recievedFullName = await instance.get(
			`/general_member/get/${fullName}`
		);
		const recievedEmail = await instance.get(`/general_member/get/${email}`);

		if (recievedFullName.data.length <= 0 && recievedEmail.data.length <= 0)
			return false;

		toast.error('You have already signed up.');
		return true;
	};

	// Handle form submission
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		// If the user has invalid inputs, show an error
		if (!canSubmit()) {
			toast.error('You have invalid inputs. Please try again.');
			return;
		}

		// Deconstruct the data
		const { fullName, email, grade, skills, extra } = data;

		try {
			setLoading(true);

			// Check if the user has already signed up
			if (await isDuplicate(fullName, email)) return;

			// Check if the user has already submitted a form today
			const lastSubmission = localStorage.getItem('generalFormLastSubmission');
			const now = new Date().getTime();

			// If the user has already submitted a form today, show an error
			if (
				lastSubmission &&
				now - parseInt(lastSubmission) < 24 * 60 * 60 * 1000
			) {
				toast.error('You can only apply once per day!');
				return;
			}

			// Send the data to the server
			const { data } = await instance.post('/general_member/post', {
				full_name: fullName,
				email: email,
				grade: grade,
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
			localStorage.setItem('generalFormLastSubmission', now.toString());
			new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
				window.location.reload();
			});
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
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
								<FormControl isRequired>
									<FormLabel>Select Your Grade</FormLabel>
									<Select
										name='grade'
										value={data.grade}
										onChange={(e) => {
											setData({ ...data, grade: parseInt(e.target.value) });
											parseInt(e.target.value) < 9 ||
											parseInt(e.target.value) > 12
												? setError({ ...error, gradeErr: true })
												: setError({ ...error, gradeErr: false });
										}}
										isInvalid={error.gradeErr}
										isRequired
									>
										<option value='0'>Select Your Grade</option>
										<option value='9'>9</option>
										<option value='10'>10</option>
										<option value='11'>11</option>
										<option value='12'>12</option>
									</Select>
								</FormControl>
							</Stack>
							<FormControl isRequired>
								<FormLabel>
									Skills In CyberSecurity or Low Level Programming (for the pace
									of the club)
								</FormLabel>
							</FormControl>
							<Slider
								id='slider'
								defaultValue={50}
								min={0}
								max={100}
								colorScheme='purple'
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
									bg={useColorModeValue('purple.600', 'purple.200')}
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
								{extrInpChars >= 0 ? (
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
								bg={useColorModeValue('purple.400', 'purple.500')}
								_hover={{
									bg: useColorModeValue('purple.600', 'purple.700')
								}}
								rounded='md'
								w={{ base: '100%', md: 'max-content' }}
								isLoading={loading}
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
