import { useState, RefObject } from 'react';

interface InputProp {
	Label?: string;
	Id: string;
	Type: string;
	Name: string;
	Placeholder: string;
	MaxLength?: number;
	Hint?: string;
	Ref?: RefObject<HTMLInputElement>;
	onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
}

export default function InputComponent(prop: InputProp) {
	const [showHint, setShowHint] = useState(true);
	return (
		<div className="form-group">
			{prop.Label && <label htmlFor={prop.Id}>{prop.Label}</label>}
			<input
				className="form-control mt-2"
				id={prop.Id}
				type={prop.Type}
				name={prop.Name}
				placeholder={prop.Placeholder}
				ref={prop.Ref}
				maxLength={prop.MaxLength}
				aria-describedby={prop.Id + 'Hint'}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					setShowHint(event.currentTarget.value.length === 0);
					if (prop.onChange) prop.onChange(event);
				}}
			/>
			{showHint && prop.Hint && (
				<small id={prop.Id + 'Hint'} className="form-text text-danger">
					{prop.Hint}
				</small>
			)}
		</div>
	);
}
