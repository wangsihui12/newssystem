import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import htmlToDraft from 'html-to-draftjs'
export default function NewsEditor (props) {
  const [editorState, setEditorState] = useState('')

  useEffect(() => {
    // console.log(props.content)
    const html = props.content
    if (html === undefined) return
    const contentBlock = htmlToDraft(html)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      )
      const editorState = EditorState.createWithContent(contentState)
      setEditorState(editorState)
    }
  }, [props.content])
  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName='toolbarClassName'
        wrapperClassName='wrapperClassName'
        editorClassName='editorClassName'
        onEditorStateChange={editorState => setEditorState(editorState)}
        // 失去焦点拿到数据
        onBlur={() => {
          //   console.log(
          //     draftToHtml(convertToRaw(editorState.getCurrentContent()))
          //   )
          //   将数据传给父组件
          props.getContent(
            draftToHtml(convertToRaw(editorState.getCurrentContent()))
          )
        }}
      />
    </div>
  )
}
