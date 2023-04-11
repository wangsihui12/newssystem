import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
import { Button, Popconfirm } from 'antd'

export default function Unpublished () {
  // 1===未发布
  const { dataSource, handlePublish } = usePublish(1)

  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={id => (
          <Popconfirm
            title='提醒'
            description='是否进行次操作?'
            okText='是'
            cancelText='否'
            onConfirm={() => handlePublish(id)}
          >
            <Button type='primary'>发布</Button>
          </Popconfirm>
        )}
      ></NewsPublish>
    </div>
  )
}
