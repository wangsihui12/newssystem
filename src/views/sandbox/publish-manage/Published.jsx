import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
import { Button, Popconfirm } from 'antd'

export default function Published () {
  // 2===已发布
  const { dataSource, handleSunset } = usePublish(2)

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
            onConfirm={() => handleSunset(id)}
          >
            <Button danger>下线</Button>
          </Popconfirm>
        )}
      ></NewsPublish>
    </div>
  )
}
