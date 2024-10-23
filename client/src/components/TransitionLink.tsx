import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

const variants = {
	hidden: { opacity: 0, x: -200, y: 0 },
	enter: { opacity: 1, x: 0, y: 0 },
	exit: { opacity: 0, x: 0, y: -100 }
};

interface PageTransitionProps {
	children: ReactNode;
}

const TransitionLink = ({ children }: PageTransitionProps) => {
	return (
		<AnimatePresence>
			<motion.div
				initial='hidden'
				animate='enter'
				exit='exit'
				variants={variants}
				transition={{ type: 'spring', duration: 1 }}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};

export default TransitionLink;
