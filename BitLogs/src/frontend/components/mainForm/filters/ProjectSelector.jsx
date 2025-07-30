import React from "react";
import { Box, Text, Select } from "@forge/react";

const ProjectSelector = ({ projects, onChange }) => {
	return (
		<>
			<Text weight="bold" size="medium">Proyecto</Text>
			<Box paddingBlockEnd="space.100" paddingBlockStart="space.100">
				<Select
					id="project-select"
					options={projects.map((p) => ({ label: p.name, value: p.key }))}
					placeholder="Selecciona uno o varios proyectos"
					isMulti
					onChange={(selected) => {
						const values = Array.isArray(selected)
							? selected.map((opt) => opt.value)
							: selected
								? [selected.value]
								: [];
						onChange(values);
					}}
				/>
			</Box>
		</>
	);
};

export default ProjectSelector;
