import { RefObject } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import Option from '../../../Models/Miscallaneous/Option.Model';

interface DropDownProp {
	Id: string;
	Items: Option[];
	Loading: boolean;
	Error: string;
	Ref?: RefObject<Multiselect>;
	PlaceHolder: string;
	onSelect(selectedList: Option[], selectedItem: Option): void;
	onRemove(selectedList: Option[], removedItem: Option): void;
}

export default function DropDownComponent(prop: DropDownProp) {
	return (
		<>
			<Multiselect
				id={prop.Id}
				options={prop.Items}
				placeholder={prop.PlaceHolder}
				hidePlaceholder={true}
				singleSelect={true}
				displayValue="name"
				ref={prop.Ref}
				loading={prop.Loading}
				onSelect={prop.onSelect}
				onRemove={prop.onRemove}
				emptyRecordMsg={prop.Error}
			/>
		</>
	);
}
