import { useNavigate } from 'react-router-dom'
import { Badge, Avatar } from 'rsuite'
import NoticeIcon from '@rsuite/icons/Notice'
import './Header.css'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="header">
      <div className="h-right">
        <Badge content={3} color="red">
          <button className="h-icon-btn">
            <NoticeIcon style={{ fontSize: 20, color: '#5b6f8a' }} />
          </button>
        </Badge>
        <Avatar
          circle
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=dash1"
          alt="User"
          size="sm"
          style={{ cursor: 'pointer', border: '2px solid #dde6f2' }}
          onClick={() => navigate('/profile')}
        />
      </div>
    </header>
  )
}