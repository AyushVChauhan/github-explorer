import { IconButton, useColorMode } from "@chakra-ui/react";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import { IoLogoReact } from "react-icons/io5";

function Header() {
	const { colorMode, toggleColorMode } = useColorMode();
	return (
		<div className="h-16 flex items-center border-b border-b-slate-500">
			<div className="md:text-3xl text-xl w-full flex items-center md:ps-10 ps-5 md:gap-x-5 gap-x-2">
				<IoLogoReact className="animate-spin-slow text-4xl md:text-5xl" /> <div>Github Explorer</div>
			</div>
			<div className="md:pe-10 pe-5">
				<IconButton
					variant="ghost"
					rounded={1000}
					onClick={toggleColorMode}
					aria-label="color-mode"
					icon={colorMode == "light" ? <IoMdSunny size={30} /> : <IoMdMoon size={30} />}
				/>
			</div>
		</div>
	);
}

export default Header;
