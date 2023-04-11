import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
import { Button, Popconfirm } from 'antd'

export default function Sunset () {
  // 3===已下线
  const { dataSource, handleDelete } = usePublish(3)

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
            onConfirm={() => handleDelete(id)}
          >
            <Button danger>删除</Button>
          </Popconfirm>
        )}
      ></NewsPublish>
    </div>
  )
}
