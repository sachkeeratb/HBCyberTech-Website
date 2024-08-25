import { Box, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function General() {
	return (
		<Box>
			<Heading as='h1' size='xl' mb={6} mt={4}>
				General Discussion
			</Heading>
			<ol>
				<li className='row'>
					<Link to='/item'>
						<h4 className='title'>General Discussion</h4>
						<div className='content'>
							<p className='timestamp'>Posted on 2021-09-01</p>
							<p className='comment-count'>
								This category is for general discussions and conversations.
							</p>
						</div>
					</Link>
				</li>
			</ol>
		</Box>
	);
}
