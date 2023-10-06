import { useState, useEffect } from 'react';
import AddLanguageComponent from './AddLanguageComponent';
import DeleteLanguageComponent from './DeleteLanguageComponent';
import Language from '../../../../Models/Language.Model';
import apiCall from '../../../../Utility/MakeRequest';

interface EditLanguageProp {
	AddedLanguages: Language[];
	onLanguagesUpdated(updatedLanguages: Language[]): void;
}

export default function EditLanguageComponent(prop: EditLanguageProp) {
	const [languages, setLanguages] = useState<string[]>();
	const [languageError, setLanguageError] = useState('');
	const [languageLoading, setLanguageLoading] = useState(false);

	useEffect(() => {
		getLanguages();
	}, []);

	const getLanguages = async () => {
		setLanguageLoading(true);
		const response = await apiCall('get', 'languages');
		if (response.error) {
			setLanguageError(response.error);
		} else {
			const data: string[] = response.response;
			setLanguageError('');
			setLanguages(data);
		}
		setLanguageLoading(false);
	};

	return (
		<>
			<label>Language Proficiencies</label>
			{prop.AddedLanguages.map((addedLanguage, index) => (
				<DeleteLanguageComponent
					key={addedLanguage.name + addedLanguage.proficiency}
					Index={index + 1}
					Language={addedLanguage}
					onLanguageDeleted={(deletedLanguage) => {
						const updatedLanguages = prop.AddedLanguages.filter(
							(language) => language.name != deletedLanguage
						);
						prop.onLanguagesUpdated(updatedLanguages);
					}}
				/>
			))}
			<AddLanguageComponent
				Languages={(languages || []).filter(
					(language) =>
						!prop.AddedLanguages.some(
							(addedLanguage) => addedLanguage.name == language
						)
				)}
				LanguageError={languageError}
				LoadingLanguage={languageLoading}
				addLanguage={(addedLanguage) => {
					const updatedLanguages = prop.AddedLanguages.slice(0);
					updatedLanguages.push({
						name: addedLanguage.name,
						proficiency: addedLanguage.proficiency,
					});
					prop.onLanguagesUpdated(updatedLanguages);
				}}
			/>
			{prop.AddedLanguages.length === 0 && (
				<small className="form-text text-danger">
					Must select at least one language
				</small>
			)}
		</>
	);
}
