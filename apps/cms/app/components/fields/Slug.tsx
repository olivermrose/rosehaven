"use client";

import { Button, FieldLabel, TextInput, useField, useForm, useFormFields } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";
import React, { useCallback, useEffect } from "react";
import { slugify } from "@/app/util";

interface Props extends TextFieldClientProps {
	fieldToUse: string;
	checkboxFieldPath: string;
}

export function Slug({ field, fieldToUse, checkboxFieldPath, path, readOnly }: Props) {
	const { value, setValue } = useField<string>({ path: path || field.name });
	const { dispatchFields } = useForm();

	const checkboxPath = path?.includes(".") ? `${path}.${checkboxFieldPath}` : checkboxFieldPath;

	const checkboxValue = useFormFields(([fields]) => {
		return fields[checkboxPath]?.value as string;
	});

	const targetFieldValue = useFormFields(([fields]) => {
		return fields[fieldToUse]?.value as string;
	});

	useEffect(() => {
		if (checkboxValue) {
			if (targetFieldValue) {
				const formattedSlug = slugify(targetFieldValue);

				if (value !== formattedSlug) {
					setValue(formattedSlug);
				}
			} else {
				if (value !== "") setValue("");
			}
		}
	}, [targetFieldValue, checkboxValue, setValue, value]);

	const handleLock = useCallback(
		(event: React.MouseEvent<Element>) => {
			event.preventDefault();

			dispatchFields({
				type: "UPDATE",
				path: checkboxFieldPath,
				value: !checkboxValue,
			});
		},
		[checkboxValue, checkboxFieldPath, dispatchFields],
	);

	return (
		<div className="field-type">
			<div className="flex items-center justify-between">
				<FieldLabel htmlFor={`field-${path}`} label={field.label} />

				<Button className="pb-1.25 m-0" buttonStyle="none" onClick={handleLock}>
					{checkboxValue ? "Unlock" : "Lock"}
				</Button>
			</div>

			<TextInput
				value={value}
				onChange={setValue}
				path={path || field.name}
				readOnly={Boolean(readOnly || checkboxValue)}
			/>
		</div>
	);
}
