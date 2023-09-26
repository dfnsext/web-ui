import { FunctionalComponent, VNode, h } from "@stencil/core";
import { toastController } from "@ionic/core";

const styles = `
	display: flex;
	justify-content: center;
	align-items: center;
	user-select: none;
	cursor: pointer;
	width: 100%;
`;

interface CopyClipboardProps {
	onClick?: () => void;
	value: string;
	openToaster: boolean;
}

export const CopyClipboard: FunctionalComponent<CopyClipboardProps> = ({ onClick, value, openToaster }, children) => {
	const handleClick = async (e: MouseEvent) => {
		onClick?.();
		e.preventDefault();
		e.stopPropagation();
		try {
			await navigator.clipboard.writeText(value);
			// if (openToaster) {
			// 	const toast = await toastController.create({
			// 		message: value,
			// 		duration: 2000,
			// 	});
			// 	await toast.present();
			// }
		} catch (err) {
			console.warn(err);
		}
	};

	const modifiedChildren = children.map((child: VNode) => {
    const modifiedVattrs = {
      ...child.$attrs$,
      class: `${child.$attrs$.class || ''} add-class`,
    };
    
    return {
      ...child,
      vattrs: modifiedVattrs,
    };
  });

	return (
		<div class={styles} onClick={handleClick}>
			{modifiedChildren}
		</div>
	);
};
