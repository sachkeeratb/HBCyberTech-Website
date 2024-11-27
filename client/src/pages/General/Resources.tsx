// client/src/pages/General/Resources.tsx
import React, { useState, useEffect } from 'react';
import {
	Box,
	Container,
	Input,
	Select,
	SimpleGrid,
	Heading,
	Text,
	Flex,
	Button,
	SlideFade,
	chakra
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Resource {
	title: string;
	link: string;
	description: string;
	tags: string[];
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

export default function Resources() {
	const [resources, setResources] = useState<Resource[]>([]);
	const [search, setSearch] = useState('');
	const [tag, setTag] = useState();
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchResources();
	}, [page, search, tag]);

	const fetchResources = async () => {
		setLoading(true);
		try {
			const response = await instance.get('/resources', {
				params: {
					page: page,
					limit: 9,
					search: search,
					field: 'title',
					tag: tag || ''
				}
			});

			setResources(response.data);
			setHasMore(response.data.length === 9);
		} catch (error) {
			console.error('Error fetching resources:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
		setPage(1);
		setResources([]);
		setHasMore(true);
	};

	const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setTag(event.target.value);
		setPage(1);
		setResources([]);
		setHasMore(true);
	};

	return (
		<Container maxW='7xl' p={5}>
			<Heading as='h1' size='xl' mb={6} textAlign='center'>
				Resources
			</Heading>
			<Flex mb={4} justifyContent='space-between'>
				<Input
					placeholder='Search resources...'
					value={search}
					onChange={handleSearchChange}
					maxWidth='73%'
				/>
				<Select maxWidth='25%' onChange={handleTagChange}>
					<option value='' defaultValue>
						Select
					</option>
					<option value='CTF'>CTF</option>
					<option value='Cybersecurity'>Cybersecurity</option>
					<option value='Website'>Website</option>
					<option value='Hardware'>Hardware</option>
					<option value='Community'>Community</option>
				</Select>
			</Flex>
			<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
				{resources.map((resource, index) => (
					<SlideFade in={true} offsetY='50vh' key={index}>
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Box
								p={5}
								shadow='md'
								borderWidth='1px'
								borderRadius='md'
								bg='white'
								_dark={{ bg: 'gray.800' }}
							>
								<Heading fontSize='xl' mb={2}>
									<motion.div
										whileHover={{ scale: 1.25 }}
										whileTap={{ scale: 0.95 }}
									>
										<chakra.a
											href={resource.link}
											target='_blank'
											rel='noopener noreferrer'
										>
											{resource.title}
										</chakra.a>
									</motion.div>
								</Heading>
								<Text mt={4}>{resource.description}</Text>
								<Text mt={2} fontSize='sm' color='gray.500'>
									Tags: {resource.tags.join(', ')}
								</Text>
							</Box>
						</motion.div>
					</SlideFade>
				))}
			</SimpleGrid>
			{loading && <Text>Loading...</Text>}
			<Flex justifyContent='space-between' mt={4}>
				<Button
					onClick={() => setPage((page) => Math.max(page - 1, 1))}
					disabled={page === 1}
				>
					Previous
				</Button>
				<Text pt={'1vh'}>Page {page}</Text>
				<Button
					onClick={() => {
						if (hasMore) setPage((page) => page + 1);
					}}
					disabled={!hasMore}
				>
					Next
				</Button>
			</Flex>
		</Container>
	);
}
