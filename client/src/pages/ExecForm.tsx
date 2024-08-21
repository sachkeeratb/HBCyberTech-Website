import React, { useState } from 'react';
import {
	Container,
	FormControl,
	FormLabel,
	Select,
	Stack,
	Heading,
	useColorModeValue,
	VStack,
	Flex,
	Text,
	Divider
} from '@chakra-ui/react';

const developmentQuestions = () => {
	// Render development executive questions here
	return <div>Development Executive Questions</div>;
};

const marketingQuestions = () => {
	// Render marketing executive questions here
	return <div>Marketing Executive Questions</div>;
};

const eventsQuestions = () => {
	// Render events executive questions here
	return <div>Events Executive Questions</div>;
};

export default function ExecForm() {
	const [execType, setExecType] = useState('');

	const handleExecTypeChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setExecType(event.target.value);
	};

	const renderExecQuestions = () => {
		switch (execType) {
			case 'development':
				return developmentQuestions();
			case 'marketing':
				return marketingQuestions();
			case 'events':
				return eventsQuestions();
			default:
				return null;
		}
	};

	const formBG = useColorModeValue('white', 'gray.700');

	return (
		<Container maxW='7xl' py={10} px={{ base: 5, md: 8 }}>
			<Stack spacing={10}>
				<Flex align='center' justifyContent='center' direction='column'>
					<Heading fontSize='4xl' mb={2}>
						Executive Form
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
				<VStack
					spacing={8}
					w='100%'
					bg={formBG}
					rounded='lg'
					boxShadow='lg'
					p={{ base: 5, sm: 10 }}
				>
					<FormControl>
						<FormLabel>Select Executive Type</FormLabel>
						<Select value={execType} onChange={handleExecTypeChange}>
							<option value=''>Select Executive Type</option>
							<option value='development'>Development</option>
							<option value='marketing'>Marketing</option>
							<option value='events'>Events</option>
						</Select>
					</FormControl>
					{renderExecQuestions()}
				</VStack>
			</Stack>
		</Container>
	);
}
