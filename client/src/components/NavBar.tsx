'use client';

import {
	Box,
	Flex,
	Text,
	IconButton,
	Button,
	Stack,
	Collapse,
	Icon,
	Popover,
	PopoverTrigger,
	PopoverContent,
	useColorModeValue,
	useDisclosure,
	useColorMode
} from '@chakra-ui/react';

import {
	HamburgerIcon,
	CloseIcon,
	ChevronDownIcon,
	ChevronRightIcon
} from '@chakra-ui/icons';
import HBCyberTechLogo from '../assets/HB-CyberTechCircle.png';
import { useCookies } from 'react-cookie';

/**
 * Represents a navigation bar component.
 *
 * The NavBar component is responsible for rendering a navigation bar with various features such as a toggle button, sign out button, and color mode toggle button. It provides a responsive design for both desktop and mobile devices.
 */

export default function NavBar() {
	// Hooks for managing state and behavior
	const { isOpen, onToggle } = useDisclosure();
	const { colorMode, toggleColorMode } = useColorMode();
	const [cookies, , removeCookie] = useCookies(['user', 'admin']);

	return (
		<Box>
			{/* Desktop Navigation */}
			<Flex
				bg={useColorModeValue('white', 'gray.800')}
				color={useColorModeValue('gray.600', 'white')}
				maxH={'60px'}
				borderBottom={1}
				borderStyle={'solid'}
				borderColor={useColorModeValue('gray.200', 'gray.900')}
				align={'center'}
			>
				<Flex
					flex={{ base: 1, md: 'auto' }}
					ml={{ base: -2 }}
					display={{ base: 'flex', md: 'none' }}
				>
					<IconButton
						onClick={onToggle}
						icon={
							isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
						}
						variant={'ghost'}
						aria-label={'Toggle Navigation'}
					/>
				</Flex>
				<Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
					<Flex display={{ base: 'none', md: 'flex' }} mt={-2}>
						<a>
							<img src={HBCyberTechLogo} className='logo' alt='HB CyberTech' />
						</a>
					</Flex>

					<Flex display={{ base: 'none', md: 'flex' }} ml={10} mt={7}>
						<DesktopNav />
					</Flex>
				</Flex>

				<Stack
					flex={{ base: 1, md: 0 }}
					justify={'flex-end'}
					direction={'row'}
					spacing={6}
				>
					{/* Sign Out Button */}
					{cookies.user || cookies.admin ? (
						<Button
							as={'a'}
							fontSize={'sm'}
							fontWeight={600}
							href={'#'}
							onClick={() => {
								if (cookies.user) removeCookie('user');
								else removeCookie('admin');
								window.location.reload();
							}}
						>
							Sign Out
						</Button>
					) : (
						<></>
					)}
					{/* Color Mode Toggle Button */}
					<Button
						as={'a'}
						mb={2}
						display={{ base: 'none', md: 'inline-flex' }}
						fontSize={'sm'}
						fontWeight={600}
						href={'#'}
						onClick={toggleColorMode}
					>
						{colorMode === 'light' ? '🌑' : '🌕'}
					</Button>
				</Stack>
			</Flex>

			{/* Mobile Navigation */}
			<Collapse in={isOpen} animateOpacity>
				<MobileNav />
			</Collapse>
		</Box>
	);
}

// Component for desktop navigation
const DesktopNav = () => {
	// Hooks for managing color mode and disclosure state
	const linkColor = useColorModeValue('gray.600', 'gray.200');
	const linkHoverColor = useColorModeValue('gray.800', 'white');
	const popoverContentBgColor = useColorModeValue('white', 'gray.800');

	const [cookies] = useCookies(['user', 'admin']);

	return (
		<Stack direction={'row'} spacing={4}>
			{NavItems.map((navItem) => (
				<Box key={navItem.label}>
					<Popover trigger={'hover'} placement={'bottom-start'}>
						<PopoverTrigger>
							<Box
								as='a'
								p={2}
								href={navItem.href ?? '#'}
								fontSize={'sm'}
								fontWeight={600}
								color={linkColor}
								_hover={{
									textDecoration: 'none',
									color: linkHoverColor
								}}
							>
								{navItem.label}
							</Box>
						</PopoverTrigger>

						{navItem.children && (
							<PopoverContent
								border={0}
								boxShadow={'xl'}
								bg={popoverContentBgColor}
								p={4}
								rounded={'xl'}
								minW={'sm'}
							>
								<Stack>
									{navItem.children.map((child) => (
										<DesktopSubNav key={child.label} {...child} />
									))}
								</Stack>
							</PopoverContent>
						)}
					</Popover>
				</Box>
			))}

			{cookies.admin ? (
				<Box>
					<Popover trigger={'hover'} placement={'bottom-start'}>
						<PopoverTrigger>
							<Box
								as='a'
								p={2}
								href={'/admin'}
								fontSize={'sm'}
								fontWeight={600}
								color={linkColor}
								_hover={{
									textDecoration: 'none',
									color: linkHoverColor
								}}
							>
								Admin
							</Box>
						</PopoverTrigger>
					</Popover>
				</Box>
			) : (
				<></>
			)}
		</Stack>
	);
};

// Component for desktop sub-navigation
const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
	return (
		<Box
			as='a'
			href={href}
			role={'group'}
			display={'block'}
			p={2}
			rounded={'md'}
			_hover={{ bg: useColorModeValue('purple.50', 'gray.900') }}
		>
			<Stack direction={'row'} align={'center'}>
				<Box>
					<Text
						transition={'all .3s ease'}
						_groupHover={{ color: 'purple.400' }}
						fontWeight={500}
					>
						{label}
					</Text>
					<Text fontSize={'sm'}>{subLabel}</Text>
				</Box>
				<Flex
					transition={'all .3s ease'}
					transform={'translateX(-10px)'}
					opacity={0}
					_groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
					justify={'flex-end'}
					align={'center'}
					flex={1}
				>
					<Icon color={'purple.400'} w={5} h={5} as={ChevronRightIcon} />
				</Flex>
			</Stack>
		</Box>
	);
};

// Component for mobile navigation
const MobileNav = () => {
	// Hooks for managing color mode
	const { colorMode, toggleColorMode } = useColorMode();

	const [cookies] = useCookies(['user', 'admin']);

	return (
		<Stack
			bg={useColorModeValue('white', 'gray.800')}
			p={4}
			display={{ md: 'none' }}
		>
			{NavItems.map((navItem) => (
				<MobileNavItem key={navItem.label} {...navItem} />
			))}
			{cookies.admin ? (
				<MobileNavItem label={'Admin'} href={'/admin'} />
			) : (
				<></>
			)}
			<Button as={'a'} py={2} href={'#'} onClick={toggleColorMode}>
				{colorMode === 'light' ? '🌑' : '🌕'}
			</Button>
		</Stack>
	);
};

// Component for mobile navigation item
const MobileNavItem = ({ label, children, href }: NavItem) => {
	// Hook for managing disclosure state
	const { isOpen, onToggle } = useDisclosure();

	return (
		<Stack spacing={4} onClick={children && onToggle}>
			<Box
				py={2}
				as='a'
				href={href ?? '#'}
				justifyContent='space-between'
				alignItems='center'
				_hover={{
					textDecoration: 'none'
				}}
			>
				<Text
					fontWeight={600}
					color={useColorModeValue('gray.600', 'gray.200')}
				>
					{label}
				</Text>
				{children && (
					<Icon
						as={ChevronDownIcon}
						transition={'all .25s ease-in-out'}
						transform={isOpen ? 'rotate(180deg)' : ''}
						w={6}
						h={6}
					/>
				)}
			</Box>

			<Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
				<Stack
					mt={2}
					pl={4}
					borderLeft={1}
					borderStyle={'solid'}
					borderColor={useColorModeValue('gray.200', 'gray.700')}
					align={'start'}
				>
					{children &&
						children.map((child) => (
							<Box as='a' key={child.label} py={2} href={child.href}>
								{child.label}
							</Box>
						))}
				</Stack>
			</Collapse>
		</Stack>
	);
};

// Navigation Items
interface NavItem {
	label: string;
	subLabel?: string;
	children?: NavItem[];
	href: string;
}

const NavItems: NavItem[] = [
	{
		label: 'Home',
		href: '/'
	},
	{
		label: 'About Us',
		href: '/about'
	},
	{
		label: 'Forum',
		href: '/forum',
		children: [
			{
				label: 'Announcements',
				href: '/forum/announcements'
			},
			{
				label: 'General Discussion',
				href: '/forum/general'
			}
		]
	},
	{
		label: 'Accounts',
		href: '#',
		children: [
			{
				label: 'Sign Up',
				href: '/signup'
			},
			{
				label: 'Sign In',
				href: '/signin'
			}
		]
	},
	{
		label: 'Links',
		href: '/links'
	}
];
