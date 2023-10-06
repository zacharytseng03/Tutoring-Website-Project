import { useState, createRef } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import DropDownComponent from '../DropDownComponent';
import Language from '../../../../Models/Language.Model';
import Option from '../../../../Models/Miscallaneous/Option.Model';

interface AddLanguageProp {
	Languages: string[];
	LanguageError: string;
	LoadingLanguage: boolean;
	addLanguage(language: Language): void;
}

export default function AddLanguageComponent(prop: AddLanguageProp) {
	const [language, setLanguage] = useState('');
	const [proficiency, setProficiency] = useState<number>();
	const [error, setError] = useState('');

	const languageRef = createRef<Multiselect>();
	const proficiencyRef = createRef<Multiselect>();

	const onSelectLanguage = (_: Option[], selectedItem: Option) => {
		setLanguage(selectedItem.id as string);
	};

	const onRemoveLanguage = () => {
		setLanguage('');
		proficiencyRef.current?.resetSelectedValues();
	};

	const onSelectProficiency = (_: Option[], selectedItem: Option) => {
		setProficiency(selectedItem.id as number);
	};

	const onRemoveProficiency = () => {
		setProficiency(undefined);
	};

	const onAddBtnClicked = () => {
		if (!language) {
			setError('A language must be selected');
		} else if (!proficiency) {
			setError('A language proficiency must be selected');
		} else {
			const addedLanguage: Language = {
				name: language,
				proficiency: proficiency,
			};
			prop.addLanguage(addedLanguage);
			languageRef.current?.resetSelectedValues();
			setLanguage('');
			proficiencyRef.current?.resetSelectedValues();
			setProficiency(undefined);
			setError('');
		}
	};

	const languages = prop.Languages.map((language) => ({
		name: language,
		id: language,
	}));

	const proficiencies = [1, 2, 3, 4, 5].map((proficiency) => ({
		name: proficiency,
		id: proficiency,
	}));
	return (
		<>
			<div className="row mt-2">
				<div className="col-6">
					<DropDownComponent
						Id="Language"
						Items={languages}
						Loading={prop.LoadingLanguage}
						Error={prop.LanguageError}
						Ref={languageRef}
						PlaceHolder="Select Language"
						onRemove={onRemoveLanguage}
						onSelect={onSelectLanguage}
					/>
				</div>
				<div className="col-4">
					<DropDownComponent
						Id="Proficiency"
						Items={proficiencies}
						Loading={false}
						Error={''}
						Ref={proficiencyRef}
						PlaceHolder="Select Proficiency"
						onRemove={onRemoveProficiency}
						onSelect={onSelectProficiency}
					/>
				</div>
				<div className="col-2">
					<button
						type="button"
						className="btn btn-primary"
						onClick={onAddBtnClicked}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							className="bi bi-plus"
							viewBox="0 0 16 16">
							<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
						</svg>
					</button>
				</div>
			</div>
			{error && <h2 className="form-text text-danger mx-auto">{error}</h2>}
		</>
	);
}
