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
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

interface FormData {
	fullName: string;
	email: string;
	execType: string;
	why: string;
	experience: string;
	extra: string;
	portfolio: string;
}

interface ErrorData {
	nameErr: boolean;
	emailErr: boolean;
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

const instance = axios.create({
	baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
	timeout: 1000,
	withCredentials: false,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': '*',
		'Access-Control-Allow-Headers': '*',
		'Content-Type': 'application/json'
	}
});

export default function ExecForm() {
	const [data, setData] = useState<FormData>({
		fullName: '',
		email: '',
		execType: '',
		why: '',
		experience: '',
		extra: '',
		portfolio: ''
	});
	const [error, setError] = useState<ErrorData>({
		nameErr: false,
		emailErr: false,
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

	const handleNameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setData({ ...data, fullName: e.target.value });
		if (
			e.target.value === '' ||
			e.target.value.length < 2 ||
			e.target.value.length > 40 ||
			!/^[A-Za-zÀ-ÖØ-öø-įĴ-őŔ-žǍ-ǰǴ-ǵǸ-țȞ-ȟȤ-ȳɃɆ-ɏḀ-ẞƀ-ƓƗ-ƚƝ-ơƤ-ƥƫ-ưƲ-ƶẠ-ỿ\s']*$/u.test(
				e.target.value
			)
		)
			setError({ ...error, nameErr: true });
		else setError({ ...error, nameErr: false });
	};
	const handleEmailInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setData({ ...data, email: e.target.value });
		if (
			!e.target.value.endsWith('@pdsb.net') ||
			e.target.value.length < 15 ||
			e.target.value.length > 20 ||
			!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value)
		)
			setError({ ...error, emailErr: true });
		else setError({ ...error, emailErr: false });
	};
	const handleWhyInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setData({ ...data, why: e.target.value });
		setChars({ ...chars, why: 600 - e.target.value.length });
		if (chars.why < 0) setError({ ...error, whyErr: true });
		else setError({ ...error, whyErr: false });
	};
	const handleExtraInputChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setData({ ...data, extra: e.target.value });
		setChars({ ...chars, extra: 200 - e.target.value.length });
		if (chars.extra < 0) setError({ ...error, extraErr: true });
		else setError({ ...error, extraErr: false });
	};
	const handleExperienceInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setData({ ...data, experience: e.target.value });
		setChars({ ...chars, experience: 600 - e.target.value.length });
		if (chars.experience < 0) setError({ ...error, experienceErr: true });
		else setError({ ...error, experienceErr: false });
	};
	const handlePortfolioInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setData({ ...data, portfolio: e.target.value });
		if (e.target.value.length > 0)
			error.portfolioErr = !isValidUrl(e.target.value);
		else error.portfolioErr = data.execType === 'marketing';
	};

	const isValidUrl = (urlString: string): boolean => {
		const urlPattern = new RegExp(
			'^(https?:\\/\\/)?' + // validate protocol
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
				'((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
				'(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
				'(\\#[-a-z\\d_]*)?$',
			'i'
		); // validate fragment locator
		return !!urlPattern.test(urlString);
	};

	function canSubmit(): boolean {
		return !(
			error.nameErr ||
			error.emailErr ||
			error.execTypeErr ||
			error.whyErr ||
			error.experienceErr ||
			error.portfolioErr ||
			error.extraErr
		);
	}

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

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!canSubmit()) {
			toast.error('You have invalid inputs. Please try again.');
			return;
		}

		const { fullName, email, execType, why, experience, portfolio, extra } =
			data;
		try {
			if (await isDuplicate(fullName, email)) return;

			const { data } = await instance.post('/executive_member/post', {
				full_name: fullName,
				email: email,
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
			new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
				window.location.reload();
			});
		} catch (error) {
			console.log(error);
		}
	};

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
						<FormControl>
							<FormLabel>Select Executive Type</FormLabel>
							<Select
								name='execType'
								value={data.execType}
								onChange={handleChange}
								isInvalid={error.execTypeErr}
								isRequired
							>
								<option value=''>Select Executive Type</option>
								<option value='development'>Development</option>
								<option value='marketing'>Marketing</option>
								<option value='events'>Events</option>
							</Select>
						</FormControl>
						<VStack
							spacing={8}
							w='100%'
							bg={formBG}
							rounded='lg'
							boxShadow='lg'
							p={{ base: 5, sm: 10 }}
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
								{chars.why >= 50 ? (
									<Text fontSize='sm' textAlign={'right'}>
										{chars.why}
									</Text>
								) : (
									<Text fontSize='sm' textAlign={'right'} color={'red'}>
										{chars.why}
									</Text>
								)}
							</FormControl>

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
								{chars.experience >= 50 ? (
									<Text fontSize='sm' textAlign={'right'}>
										{chars.experience}
									</Text>
								) : (
									<Text fontSize='sm' textAlign={'right'} color={'red'}>
										{chars.experience}
									</Text>
								)}
							</FormControl>
							{data.execType === 'events' || data.execType == 'development' ? (
								<FormControl id='portfolio' isInvalid={error.portfolioErr}>
									<FormLabel pl={1}>
										Input a Link to a Project or Portfolio You Believe Will
										Enhance Your Application
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
									<FormLabel pl={1}>Input a Link to Your Portfolio</FormLabel>
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
							{chars.extra >= 50 ? (
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
