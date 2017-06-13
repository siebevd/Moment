import React from 'react';

class TodoItem extends React.Component {

	state = {
		test: false
	}

	onChange = (e) => {
		const checked = e.target.checked
		const { editor, node } = this.props

		const state = editor
		 .getState()
		 .transform()
		 .setNodeByKey(node.key, { data: { checked }}) // Update the store to the new checked state
		 .apply()

	 editor.onChange(state)
	}

	render () {

		const checked = this.props.node.data.get('checked');

		// console.log('this is checked', checked, this.props.children)

		// console.log('is it checked', checked);
		return (
			<li className={`list-check ${checked ? 'list-checked': ''}`}>
				<div contentEditable={false} className="list-checkContainer">
					<input
						type="checkbox"
						className="list-checkbox"
						checked={checked}
						onChange={this.onChange}
						id={this.props.node.key}
					/>
					<label
						htmlFor={this.props.node.key}
						className="list-customCheckbox"
					/>
				</div>
				<span contentEditable={true} className="list-editable" suppressContentEditableWarning>
					{this.props.children}
				</span>
			</li>
		)
	}
}

export default TodoItem;
