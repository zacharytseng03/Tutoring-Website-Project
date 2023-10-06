interface TabProp {
	Tabs: string[];
	SelectedTab: number;
	setSelectedTab(index: number): void;
}

export default function TabsComponent(prop: TabProp) {
	const tabs = prop.Tabs.map((tab, index) => (
		<li className="nav-item" key={tab + index}>
			<button
				className={prop.SelectedTab === index ? 'nav-link active' : 'nav-link'}
				onClick={() => {
					prop.setSelectedTab(index);
				}}>
				{tab}
			</button>
		</li>
	));

	return (
		<>
			<ul className="nav nav-tabs nav-fill">{tabs}</ul>
		</>
	);
}
