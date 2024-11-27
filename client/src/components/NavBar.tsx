// The Navigation Bar
'use client';

// Import the Chakra UI components
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

// Import the Chakra UI icons
import {
	HamburgerIcon,
	CloseIcon,
	ChevronDownIcon,
	ChevronRightIcon
} from '@chakra-ui/icons';

// Import the Club Logo
import HBCyberTechLogo from '../assets/HB-CyberTechCircle.png';

// The useCookies hook is used to access the cookies stored in the browser
import { useCookies } from 'react-cookie';

/**
 * Represents a navigation bar component.
 *
 * The NavBar component is responsible for rendering a navigation bar with various features such as a toggle button, sign out button, and color mode toggle button. It provides a responsive design for both desktop and mobile devices.
 */

export default function NavBar() {
	// If the side bar is open for mobile devices
	const { isOpen, onToggle } = useDisclosure();

	// Hooks for managing color mode and cookies
	const { colorMode, toggleColorMode } = useColorMode();

	// Hooks for managing cookies
	const [cookies, , removeCookie] = useCookies(['user', 'admin']);

	return (
		<Box>
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
						<a key='logo'>
							<img src={HBCyberTechLogo} className='logo' alt='HB CyberTech' />
						</a>
					</Flex>

					{/* Desktop Navigation */}
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
								window.location.href = '/';
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

	// Hooks for managing cookies
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
								href={navItem.href}
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

			{/* Admin Link */}
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
			<Stack direction={'row'} align={'left'}>
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

	// Hooks for managing cookies
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

			{/* Admin Link */}
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
				href={href}
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
		href: '#',
		children: [
			{
				label: 'Core',
				// subLabel: 'The core team',
				href: '/about/core'
			},
			{
				label: 'Development',
				// subLabel: 'The slideshows and activities',
				href: '/about/development'
			},
			{
				label: 'Marketing',
				// subLabel: 'Our online and offline prescence',
				href: '/about/marketing'
			},
			{
				label: 'Events',
				// subLabel: 'The creation and management of events',
				href: '/about/events'
			}
		]
	},
	{
		label: 'Resources',
		href: '/resources'
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
