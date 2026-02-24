

import { Badge, Avatar, Whisper, Tooltip } from 'rsuite'
import NoticeIcon from '@rsuite/icons/Notice'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="h-company">Company</div>
      <div className="h-right">
        <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>Notifications</Tooltip>}>
          <Badge content={3} color="red">
            <button className="h-icon-btn"><NoticeIcon style={{ fontSize: 20, color: '#5b6f8a' }} /></button>
          </Badge>
        </Whisper>
        <Avatar circle src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" size="sm"
          style={{ cursor: 'pointer', border: '2px solid #dde6f2' }} />
      </div>
    </header>
  )
}