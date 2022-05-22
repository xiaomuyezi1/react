import React, { useState } from 'react';
import './App.less';
import axios from "axios";
import Message from './MsgFun';
import useDebounce from './useDebounce';

export default React.forwardRef((props) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [qNumber, setQNumber] = useState<string>();
  const [qname, setQName] = useState<string>();
  const [qlogo, setQLogo] = useState<string>();
  const onChange = (e: any) => {
    setShowMore(false);
    let value: string = e.target.value;
    value = value.replace(/[^\d]/g, "");
    setQNumber(value);
  }
  const searchValue = async (value: number) => {
    Message.info('查询中');
    await axios.get("https://api.uomg.com/api/qq.info", { params: { qq: value } })
      .then(res => {
        if (res.status === 200) {
          Message.success('查询成功');
          if (res?.data?.code !== 0 && res?.data) {
            setShowMore(true);
            setQName(res?.data?.name || '暂无昵称');
            setQLogo(res?.data?.qlogo);
          }
        } else {
          setShowMore(false);
          Message.error('查询失败');
        }
      })
      .catch(err => {
        console.log(333, err)
      })
  }
  const onKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      if (e.target.value !== '') {
        searchValue(e.target.value);
      } else {
        setShowMore(false);
      }
    }
  }
  const handleClickDebounce = useDebounce(onKeyDown, 500);
  return (
    <div className="test-app">
      <div className="test-app-title">QQ号查询{showMore}</div>
      <div className="test-app-content">
        <span className='test-app-qq'>QQ</span>
        <input type="text" className='test-app-input' placeholder='请输入完整的qq号码' value={qNumber} onChange={onChange} onKeyDown={handleClickDebounce} />
      </div>
      {
        showMore ? <div className='test-app-number'>
          <div className='test-app-left'>
            <img className='test-app-img' src={qlogo} alt="qq头像" />
          </div>
          <div className='test-app-right'>
            <div>{qname}</div>
            <div className='test-app-right-number'>{qNumber}</div>
          </div>
        </div> : ''
      }
    </div>
  );
});
