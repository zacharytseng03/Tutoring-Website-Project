import { useEffect, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import Subject from '../../../../Models/Subject.Model';
import apiCall from '../../../../Utility/MakeRequest';

interface SubjectFilterProp {
	onUpdate(selectedList: PseudoSubject[]): void;
}

interface PseudoSubject {
	courseString: string;
	description?: string;
}

export type { PseudoSubject };

export default function SubjectFilterComponent(prop: SubjectFilterProp) {
	const [items, setItems] = useState<PseudoSubject[]>();
	const [isLoading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		getItems();
	}, []);

	const getItems = async () => {
		const response = await apiCall('get', 'subjects');
		if (response.error) {
			setError(response.error);
		} else {
			const subjects: Subject[] = response.response;
			const pseudoSubject: PseudoSubject[] = subjects.map((subject) => ({
				courseString: `${subject.course}-${subject.level}`,
				description: subject.description,
			}));
			setItems(pseudoSubject);
		}
		setLoading(false);
	};

	return (
		<>
			<Multiselect
				options={items}
				placeholder="Filter Subjects"
				hidePlaceholder={true}
				loading={isLoading}
				onSelect={prop.onUpdate}
				onRemove={prop.onUpdate}
				emptyRecordMsg={error || 'No Subject Filters'}
				displayValue="courseString"
			/>
		</>
	);
}
