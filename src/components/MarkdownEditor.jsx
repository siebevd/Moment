import { Editor, Raw } from 'slate';
import TodoItem from './TodoItem.jsx';
import React from 'react';


const initialContent = (
	JSON.parse(localStorage.getItem('content')) ||
{"document":{"data":{},"kind":"document","nodes":[{"data":{},"kind":"block","isVoid":false,"type":"heading-one","nodes":[{"kind":"text","ranges":[{"kind":"range","text":"Hey there.","marks":[]}]}]},{"data":{},"kind":"block","isVoid":false,"type":"paragraph","nodes":[{"kind":"text","ranges":[{"kind":"range","text":"Moment supports Markdown. You can create titles by typing # + space","marks":[]}]}]},{"data":{},"kind":"block","isVoid":false,"type":"paragraph","nodes":[{"kind":"text","ranges":[{"kind":"range","text":"","marks":[]}]}]},{"data":{},"kind":"block","isVoid":false,"type":"bulleted-list","nodes":[{"data":{"checked":true},"kind":"block","isVoid":false,"type":"list-item","nodes":[{"kind":"text","ranges":[{"kind":"range","text":"Install Chrome extension","marks":[]}]}]}]},{"data":{},"kind":"block","isVoid":false,"type":"bulleted-list","nodes":[{"data":{"checked":false},"kind":"block","isVoid":false,"type":"list-item","nodes":[{"kind":"text","ranges":[{"kind":"range","text":"Create task lists by typing -","marks":[]}]}]},{"data":{"checked":false},"kind":"block","isVoid":false,"type":"list-item","nodes":[{"kind":"text","ranges":[{"kind":"range","text":"Click the circle to complete the task","marks":[]}]}]}]},{"data":{},"kind":"block","isVoid":false,"type":"bulleted-list","nodes":[{"data":{"checked":false},"kind":"block","isVoid":false,"type":"list-item","nodes":[{"kind":"text","ranges":[{"kind":"range","text":"Read articles","marks":[]}]}]},{"data":{"checked":false},"kind":"block","isVoid":false,"type":"list-item","nodes":[{"kind":"text","ranges":[{"kind":"range","text":"Get started","marks":[]}]}]}]},{"data":{"checked":false},"kind":"block","isVoid":false,"type":"paragraph","nodes":[{"kind":"text","ranges":[{"kind":"range","text":"","marks":[]}]}]},{"data":{"checked":true},"kind":"block","isVoid":false,"type":"paragraph","nodes":[{"kind":"text","ranges":[{"kind":"range","text":"","marks":[]}]}]},{"data":{},"kind":"block","isVoid":false,"type":"paragraph","nodes":[{"kind":"text","ranges":[{"kind":"range","text":"","marks":[]}]}]}]},"kind":"state"}
)


/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
	nodes: {
		'block-quote': props => <blockquote>{props.children}</blockquote>,
		'bulleted-list': props => <ul>{props.children}</ul>,
		'heading-one': props => <h1>{props.children}</h1>,
		'heading-two': props => <h2>{props.children}</h2>,
		'heading-three': props => <h3>{props.children}</h3>,
		'heading-four': props => <h4>{props.children}</h4>,
		'heading-five': props => <h5>{props.children}</h5>,
		'heading-six': props => <h6>{props.children}</h6>,
		'paragraph': props => <p>{props.children}</p>,
		'list-item': TodoItem,
	}
}


class MarkdownEditor extends React.Component {

	/**
	 * Deserialize the raw initial state.
	 *
	 * @type {Object}
	 */

	state = {
		state: Raw.deserialize(initialContent, { terse: true })
	};

	componentWillMount(){
		this.visible = true;

		document.addEventListener('visibilitychange', this.visibilityChangeEvent);

	}


	/**
	 * Event handler for when the visibility changes
	 *
	 */
	visibilityChangeEvent = () => {


		if (this.visible && document.hidden) {
			// Tab is hidden again
			this.visible = false;
		}

		if (!this.visible && !document.hidden) {
			// Tab has become active again
			this.visible = true;

			// Update the content from local storage
			let updatedContent = JSON.parse(localStorage.getItem('content')) || initialContent;
			this.setState({ state: Raw.deserialize(updatedContent, { terse: true }) });
		}

	}

	/**
	 * Get the block type for a series of auto-markdown shortcut `chars`.
	 *
	 * @param {String} chars
	 * @return {String} block
	 */

	getType = (chars) => {
		switch (chars) {
			case '*':
			case '-':
			case '+': return 'list-item'
			case '>': return 'block-quote'
			case '#': return 'heading-one'
			case '##': return 'heading-two'
			case '###': return 'heading-three'
			case '####': return 'heading-four'
			case '#####': return 'heading-five'
			case '######': return 'heading-six'
			default: return null
		}
	}



	/**
	 * On change.
	 *
	 * @param {State} state
	 */

	onChange = (state) => {
		this.setState({ state });

		const content = JSON.stringify(Raw.serialize(state))
		localStorage.setItem('content', content)
	}

	/**
	 * On key down, check for our specific key shortcuts.
	 *
	 * @param {Event} e
	 * @param {Data} data
	 * @param {State} state
	 * @return {State or Null} state
	 */

	onKeyDown = (e, data, state) => {
		switch (data.key) {
			case 'space': return this.onSpace(e, state)
			case 'backspace': return this.onBackspace(e, state)
			case 'enter': return this.onEnter(e, state)
		}
	}

	/**
	 * On space, if it was after an auto-markdown shortcut, convert the current
	 * node into the shortcut's corresponding type.
	 *
	 * @param {Event} e
	 * @param {State} state
	 * @return {State or Null} state
	 */

	onSpace = (e, state) => {
		if (state.isExpanded) return
		const { startBlock, startOffset } = state
		const chars = startBlock.text.slice(0, startOffset).replace(/\s*/g, '')
		const type = this.getType(chars)


		if (!type) return
		if (type == 'list-item' && startBlock.type == 'list-item') return
		e.preventDefault()


		const transform = state
			.transform()
			.setBlock({type, data:{checked: false}}); // lets force false for now


		if (type == 'list-item') transform.wrapBlock('bulleted-list')
		state = transform
			.extendToStartOf(startBlock)
			.delete()
			.apply()

		return state
	}

	/**
	 * On backspace, if at the start of a non-paragraph, convert it back into a
	 * paragraph node.
	 *
	 * @param {Event} e
	 * @param {State} state
	 * @return {State or Null} state
	 */

	onBackspace = (e, state) => {
		if (state.isExpanded) return
		if (state.startOffset != 0) return
		const { startBlock } = state

		if (startBlock.type == 'paragraph') return
		e.preventDefault()

		const transform = state
			.transform()
			.setBlock('paragraph')

		if (startBlock.type == 'list-item') transform.unwrapBlock('bulleted-list')

		state = transform.apply()
		return state
	}

	/**
	 * On return, if at the end of a node type that should not be extended,
	 * create a new paragraph below it.
	 *
	 * @param {Event} e
	 * @param {State} state
	 * @return {State or Null} state
	 */

	onEnter = (e, state) => {

		if (state.isExpanded) return
		const { startBlock, startOffset, endOffset } = state
		if (startOffset == 0 && startBlock.length == 0) return this.onBackspace(e, state)
		if (endOffset != startBlock.length) return

		if (
			startBlock.type != 'heading-one' &&
			startBlock.type != 'heading-two' &&
			startBlock.type != 'heading-three' &&
			startBlock.type != 'heading-four' &&
			startBlock.type != 'heading-five' &&
			startBlock.type != 'heading-six' &&
			startBlock.type != 'block-quote'
		) {

			if (startBlock.type === 'list-item') {
				return state
					.transform()
					.splitBlock()
					.setBlock({type: 'list-item', data:{checked: false}})
					.apply()
			}
			return
		}

		e.preventDefault()

		return state
			.transform()
			.splitBlock()
			.setBlock('paragraph')
			.apply()
	}

	clickHandler = () => {
		document.querySelector('.editor').focus();
	}

	/**
	 *
	 * Render the example.
	 *
	 * @return {Component} component
	 */

	render = () => {
		return (
			<div className="editorContainer" onClick={this.clickHandler}>
				<Editor
					schema={schema}
					state={this.state.state}
					onChange={this.onChange}
					onKeyDown={this.onKeyDown}
					className="editor"
				/>
			</div>
		)
	}

}

export default MarkdownEditor
