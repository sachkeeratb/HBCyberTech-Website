// A form where people can apply to be an executive member of the club

// React and Chakra UI Components
import { useState, ChangeEvent } from 'react';
import {
	Container,
	FormControl,
	FormLabel,
	Input,
	Select,
	Stack,
	Heading,
	useColorModeValue,
	VStack,
	Flex,
	Text,
	Divider,
	Button,
	FormErrorMessage,
	Textarea
} from '@chakra-ui/react';

// React Hot Toast for notifications
import { toast, Toaster } from 'react-hot-toast';

// Axios for API requests
import axios from 'axios';

// Define the data types
interface FormData {
	fullName: string;
	email: string;
	grade: number;
	execType: string;
	why: string;
	experience: string;
	extra: string;
	portfolio: string;
}

interface ErrorData {
	nameErr: boolean;
	emailErr: boolean;
	gradeErr: boolean;
	execTypeErr: boolean;
	whyErr: boolean;
	experienceErr: boolean;
	extraErr: boolean;
	portfolioErr: boolean;
}

interface CharCount {
	why: number;
	extra: number;
	experience: number;
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

export default function ExecForm() {
	// Store the data, errors, and the available characters
	const [data, setData] = useState<FormData>({
		fullName: '',
		email: '',
		grade: 0,
		execType: '',
		why: '',
		experience: '',
		extra: '',
		portfolio: ''
	});
	const [error, setError] = useState<ErrorData>({
		nameErr: false,
		emailErr: false,
		gradeErr: false,
		execTypeErr: false,
		whyErr: false,
		experienceErr: false,
		extraErr: false,
		portfolioErr: false
	});
	const [chars, setChars] = useState<CharCount>({
		why: 600,
		extra: 200,
		experience: 600
	});

	const [loading, setLoading] = useState(false);

	// Handle input changes
	const handleNameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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
	// Handle email input changes
	const handleEmailInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setData({ ...data, email: e.target.value });

		// Check if the email is valid
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
	const handleWhyInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setData({ ...data, why: e.target.value });
		setChars({ ...chars, why: 600 - e.target.value.length });
		setError({ ...error, whyErr: chars.why <= 0 });
	};
	const handleExtraInputChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setData({ ...data, extra: e.target.value });
		setChars({ ...chars, extra: 200 - e.target.value.length });
		setError({ ...error, extraErr: chars.extra <= 0 });
	};
	const handleExperienceInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setData({ ...data, experience: e.target.value });
		setChars({ ...chars, experience: 600 - e.target.value.length });
		setError({ ...error, experienceErr: chars.experience <= 0 });
	};
	// Handle portfolio input changes
	const handlePortfolioInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setData({ ...data, portfolio: e.target.value });
		if (e.target.value.length > 0)
			setError({ ...error, portfolioErr: !isValidUrl(e.target.value) });
		else setError({ ...error, portfolioErr: data.execType === 'marketing' });
	};

	// Check if the URL is valid
	const isValidUrl = (urlString: string): boolean => {
		const urlPattern = new RegExp(
			'^(https?:\\/\\/)?' + // Validate protocol
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Validate domain name
				'((\\d{1,3}\\.){3}\\d{1,3}))' + // Validate OR ip (v4) address
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Validate port and path
				'(\\?[;&a-z\\d%_.~+=-]*)?' + // Validate query string
				'(\\#[-a-z\\d_]*)?$',
			'i'
		); // Validate fragment locator
		return !!urlPattern.test(urlString);
	};

	// Check if the user can submit the form
	function canSubmit(): boolean {
		return !(
			error.nameErr ||
			error.emailErr ||
			error.gradeErr ||
			error.execTypeErr ||
			error.whyErr ||
			error.experienceErr ||
			error.portfolioErr ||
			error.extraErr
		);
	}

	// Check if the user has already signed up
	const isDuplicate = async (fullName: string, email: string) => {
		const recievedFullName = await instance.get(
			`/executive_member/get/${fullName}`
		);
		const recievedEmail = await instance.get(`/executive_member/get/${email}`);

		if (recievedFullName.data.length <= 0 && recievedEmail.data.length <= 0)
			return false;

		toast.error('You have already signed up.');
		return true;
	};

	// Handle general change
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	// Handle form submission
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		setData({
			...data,
			why: data.why.replace(/[\t\n\r]/gm, ''),
			experience: data.experience.replace(/[\t\n\r]/gm, ''),
			extra: data.extra.replace(/[\t\n\r]/gm, '')
		});

		// Destructure the data
		const {
			fullName,
			email,
			grade,
			execType,
			why,
			experience,
			portfolio,
			extra
		} = data;
		try {
			setLoading(true);

			// Check if the user has already signed up
			if (await isDuplicate(fullName, email)) return;

			// Check if the user has already submitted the form
			const lastSubmission = localStorage.getItem('execFormLastSubmission');
			const now = new Date().getTime();

			if (
				lastSubmission &&
				now - parseInt(lastSubmission) < 24 * 60 * 60 * 1000
			) {
				// Inform the user that they can only apply once per day
				toast.error('You can only apply once per day.');
				return;
			}

			// Check if the user can submit the form
			if (!canSubmit()) {
				toast.error('You have invalid inputs. Please try again.');
				return;
			}

			// Send the data to the server
			const { data } = await instance.post('/executive_member/post', {
				full_name: fullName,
				email: email,
				grade: grade,
				exec_type: execType,
				why: why,
				experience: experience,
				portfolio: portfolio,
				extra: extra,
				date_created: new Date().toISOString()
			});

			// Show the user if any input is invalid
			if (data.error) {
				toast.error(data.error);
				throw new Error(data.error);
			}

			// Allow the user to continue
			setData({} as FormData);
			toast.success('You have sucessfuly registered!');
			localStorage.setItem('execFormLastSubmission', now.toString());
			new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
				window.location.reload();
			});
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	// Set the background color of the form
	const formBG = useColorModeValue('white', 'gray.700');

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
						Executive Member Form
					</Heading>
					<Text fontSize='md' textAlign='center' mb={1}>
						Join HB CyberTech as an executive! Lead, innovate, and make an
						impact in development, marketing, or event management.
					</Text>
					<Text fontSize='md' textAlign='center'>
						Collaborate with professionals and drive our tech community forward.
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
						<Stack
							w='100%'
							spacing={3}
							direction={{ base: 'column', md: 'row' }}
						>
							<FormControl isRequired>
								<FormLabel>Select Executive Type</FormLabel>
								<Select
									name='execType'
									value={data.execType}
									onChange={(e) => {
										handleChange(e);
										setError({ ...error, execTypeErr: e.target.value === '' });
									}}
									isInvalid={error.execTypeErr}
									isRequired
								>
									<option value=''>Select Executive Type</option>
									<option value='development'>Development</option>
									<option value='marketing'>Marketing</option>
									<option value='events'>Events</option>
								</Select>
								<Text align='left' ml={1}>
									{data.execType === 'development'
										? 'You will be responsible for developing slideshows and activities.'
										: data.execType === 'marketing'
										? 'You will be responsible for creating promotional material.'
										: data.execType === 'events'
										? 'You will be responsible for planning and hosting events for the club.'
										: ''}
								</Text>
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
						<VStack
							spacing={8}
							w='100%'
							bg={formBG}
							rounded='lg'
							boxShadow='lg'
							pl={{ base: 5, sm: 10 }}
							pr={{ base: 5, sm: 10 }}
						>
							<FormControl id='why' isInvalid={error.whyErr} isRequired>
								<FormLabel pl={1}>
									Why Do You Want to Be an Executive Member?
								</FormLabel>
								<Textarea
									size='lg'
									placeholder='I am applying for this positon because ...'
									rounded='md'
									value={data.why}
									onChange={handleWhyInputChange}
								/>
								{chars.why >= 0 ? (
									<></>
								) : (
									<FormErrorMessage>
										You are only allowed to input 600 characters.
									</FormErrorMessage>
								)}
								{chars.why > 50 ? (
									<Text fontSize='sm' textAlign={'right'}>
										{chars.why}
									</Text>
								) : (
									<Text fontSize='sm' textAlign={'right'} color={'red'}>
										{chars.why}
									</Text>
								)}
							</FormControl>

							{data.execType === 'events' ? (
								<FormControl
									id='experience'
									isInvalid={error.experienceErr}
									isRequired
								>
									<FormLabel pl={1}>
										Give Two Possible Event Ideas You Would Like to Host
									</FormLabel>
									<Textarea
										size='lg'
										placeholder='My experience consists of ...'
										rounded='md'
										value={data.experience}
										onChange={handleExperienceInputChange}
									/>
									{chars.experience >= 0 ? (
										<></>
									) : (
										<FormErrorMessage>
											You are only allowed to input 600 characters.
										</FormErrorMessage>
									)}
									{chars.experience > 50 ? (
										<Text fontSize='sm' textAlign={'right'}>
											{chars.experience}
										</Text>
									) : (
										<Text fontSize='sm' textAlign={'right'} color={'red'}>
											{chars.experience}
										</Text>
									)}
								</FormControl>
							) : (
								<FormControl
									id='experience'
									isInvalid={error.experienceErr}
									isRequired
								>
									<FormLabel pl={1}>
										What Experience Do You Have in This Area?
									</FormLabel>
									<Textarea
										size='lg'
										placeholder='My experience consists of ...'
										rounded='md'
										value={data.experience}
										onChange={handleExperienceInputChange}
									/>
									{chars.experience >= 0 ? (
										<></>
									) : (
										<FormErrorMessage>
											You are only allowed to input 600 characters.
										</FormErrorMessage>
									)}
									{chars.experience > 50 ? (
										<Text fontSize='sm' textAlign={'right'}>
											{chars.experience}
										</Text>
									) : (
										<Text fontSize='sm' textAlign={'right'} color={'red'}>
											{chars.experience}
										</Text>
									)}
								</FormControl>
							)}
							{data.execType === 'events' || data.execType == 'development' ? (
								<FormControl id='portfolio' isInvalid={error.portfolioErr}>
									<FormLabel pl={1}>
										Input a Link to a Project or Portfolio You Believe Will
										Enhance Your Application &#40;e.g. Google Drive&#41;
									</FormLabel>
									<Input
										size='lg'
										placeholder='https://www.example.com/example'
										rounded='md'
										value={data.portfolio}
										onChange={handlePortfolioInputChange}
									/>
									{error.portfolioErr ? (
										<FormErrorMessage>
											You must input a valid link.
										</FormErrorMessage>
									) : (
										<></>
									)}
								</FormControl>
							) : data.execType === 'marketing' ? (
								<FormControl
									id='portfolio'
									isInvalid={error.portfolioErr}
									isRequired
								>
									<FormLabel pl={1}>
										Input a Link to Your Portfolio &#40;e.g. Google Drive&#41;
									</FormLabel>
									<Input
										size='lg'
										placeholder='https://www.example.com/example'
										rounded='md'
										value={data.portfolio}
										onChange={handlePortfolioInputChange}
									/>
									{error.portfolioErr ? (
										<FormErrorMessage>
											You must input a valid link.
										</FormErrorMessage>
									) : (
										<></>
									)}
								</FormControl>
							) : (
								<></>
							)}
						</VStack>
						<FormControl id='extra' pt={4} isInvalid={error.extraErr}>
							<FormLabel pl={1}>Additional Information</FormLabel>
							<Textarea
								size='lg'
								placeholder='Enter your (optional) message'
								rounded='md'
								value={data.extra}
								onChange={handleExtraInputChange}
							/>
							{chars.extra >= 0 ? (
								<></>
							) : (
								<FormErrorMessage>
									You are only allowed to input 200 characters.
								</FormErrorMessage>
							)}
							{chars.extra > 50 ? (
								<Text fontSize='sm' textAlign={'right'}>
									{chars.extra}
								</Text>
							) : (
								<Text fontSize='sm' textAlign={'right'} color={'red'}>
									{chars.extra}
								</Text>
							)}
						</FormControl>
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
