// // // // import { useState } from 'react'
// // // // import { Avatar, Progress, Loader, Panel, Button } from 'rsuite'
// // // // import './EfficientEmployees.css'

// // // // export default function EfficientEmployees({ data, loading, error }) {
// // // //   const [showAll, setShowAll] = useState(false)
// // // //   const INITIAL_DISPLAY = 5

// // // //   // Create header content function so it updates with showAll state
// // // //   const createHeaderContent = () => (
// // // //     <div className="eff-header-container">
// // // //       <span className="eff-title">Efficient employee's</span>
// // // //       {data?.employees?.length > INITIAL_DISPLAY && (
// // // //         <Button 
// // // //           appearance="link"
// // // //           size="sm"
// // // //           onClick={() => setShowAll(!showAll)}
// // // //           className="eff-see-more-btn"
// // // //         >
// // // //           {showAll ? 'Show less' : 'See more'}
// // // //         </Button>
// // // //       )}
// // // //     </div>
// // // //   )

// // // //   if (loading) return (
// // // //     <Panel header={createHeaderContent()} className="eff-emp-panel">
// // // //       <div className="eff-loading"><Loader size="sm" content="Loading..." /></div>
// // // //     </Panel>
// // // //   )

// // // //   if (error || !data) return (
// // // //     <Panel header={createHeaderContent()} className="eff-emp-panel">
// // // //       <div className="eff-loading">No data</div>
// // // //     </Panel>
// // // //   )

// // // //   const list = data.employees || []
// // // //   const displayedList = showAll ? list : list.slice(0, INITIAL_DISPLAY)

// // // //   return (
// // // //     <Panel header={createHeaderContent()} className="eff-emp-panel">
// // // //       <div className={`eff-list-wrapper${showAll ? ' eff-list-expanded' : ''}`}>
// // // //         <div className="eff-list">
// // // //           {displayedList.length > 0 ? (
// // // //             displayedList.map((emp, i) => {
// // // //               const pct = Math.round((emp.score / emp.maxScore) * 100)
// // // //               return (
// // // //                 <div key={emp.empId} className="eff-row">
// // // //                   <span className="eff-rank">{i+1}.</span>
// // // //                   <Avatar
// // // //                     circle
// // // //                     size="sm"
// // // //                     src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.empId}`}
// // // //                     style={{ flexShrink: 0 }}
// // // //                   />
// // // //                   <div className="eff-info">
// // // //                     <span className="eff-name">{emp.name}</span>
// // // //                     <span className="eff-id">ID: {emp.empId}</span>
// // // //                   </div>
// // // //                   <div className="eff-bar-wrap">
// // // //                     <Progress.Line
// // // //                       percent={pct}
// // // //                       strokeWidth={5}
// // // //                       showInfo={false}
// // // //                       strokeColor="var(--accent)"
// // // //                       style={{ padding: 0 }}
// // // //                     />
// // // //                   </div>
// // // //                   <span className="eff-score">{emp.score}/{emp.maxScore}</span>
// // // //                 </div>
// // // //               )
// // // //             })
// // // //           ) : (
// // // //             <div className="eff-loading">No employees</div>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </Panel>
// // // //   )
// // // // }

// // // import { useState } from 'react'
// // // import { Avatar, Progress, Loader, Panel, Button, Tag } from 'rsuite'
// // // import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
// // // import './EfficientEmployees.css'

// // // const INITIAL_DISPLAY = 5

// // // function filterLabel(calFilter) {
// // //   if (!calFilter?.dates?.length) return null
// // //   const { dates, type } = calFilter
// // //   if (type === 'today') return 'Today'
// // //   if (type === 'tomorrow') return 'Tomorrow'
// // //   if (type === 'last7') return 'Last 7 Days'
// // //   if (dates.length === 1)
// // //     return dates[0].toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
// // //   return `${dates.length} days`
// // // }

// // // export default function EfficientEmployees({ data, loading, error, calFilter }) {
// // //   const [showAll, setShowAll] = useState(false)

// // //   const label = filterLabel(calFilter)
// // //   const list = data?.employees ?? []
// // //   const hasMore = list.length > INITIAL_DISPLAY
// // //   const displayed = showAll ? list : list.slice(0, INITIAL_DISPLAY)

// // //   const header = (
// // //     <div className="eff-header-container">
// // //       <span className="eff-title">Efficient Employees</span>
// // //       {label && (
// // //         <Tag color="blue" style={{ fontSize: 10, fontWeight: 600 }}>
// // //           {label}
// // //         </Tag>
// // //       )}
// // //     </div>
// // //   )

// // //   if (loading) return (
// // //     <Panel header={header} className="eff-emp-panel">
// // //       <div className="eff-loading"><Loader size="sm" content="Loading..." /></div>
// // //     </Panel>
// // //   )

// // //   if (error || !data) return (
// // //     <Panel header={header} className="eff-emp-panel">
// // //       <div className="eff-loading">No data</div>
// // //     </Panel>
// // //   )

// // //   return (
// // //     <Panel header={header} className="eff-emp-panel">
// // //       <div className={`eff-list-wrapper${showAll ? ' eff-list-expanded' : ''}`}>

// // //         <div className="eff-list">
// // //           {displayed.length > 0 ? (
// // //             displayed.map((emp, i) => {
// // //               const pct = Math.round((emp.score / emp.maxScore) * 100)
// // //               return (
// // //                 <div key={emp.empId} className="eff-row">
// // //                   <span className="eff-rank">{i + 1}.</span>
// // //                   <Avatar
// // //                     circle size="sm"
// // //                     src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.empId}`}
// // //                     style={{ flexShrink: 0 }}
// // //                   />
// // //                   <div className="eff-info">
// // //                     <span className="eff-name">{emp.name}</span>
// // //                     <span className="eff-id">ID: {emp.empId}</span>
// // //                   </div>
// // //                   <div className="eff-bar-wrap">
// // //                     <Progress.Line
// // //                       percent={pct}
// // //                       strokeWidth={5}
// // //                       showInfo={false}
// // //                       strokeColor="var(--accent)"
// // //                       style={{ padding: 0 }}
// // //                     />
// // //                   </div>
// // //                   <span className="eff-score">{emp.score}/{emp.maxScore}</span>
// // //                 </div>
// // //               )
// // //             })
// // //           ) : (
// // //             <div className="eff-loading">No employees</div>
// // //           )}
// // //         </div>

// // //         {/* View more / Show less — bottom of panel */}
// // //         {hasMore && (
// // //           <div className="eff-view-more-wrap">
// // //             <Button
// // //               block
// // //               appearance="subtle"
// // //               size="sm"
// // //               startIcon={showAll ? <BsChevronUp /> : <BsChevronDown />}
// // //               onClick={() => setShowAll(v => !v)}
// // //               className="eff-view-more-btn"
// // //             >
// // //               {showAll ? 'Show less' : `View more (${list.length - INITIAL_DISPLAY} more)`}
// // //             </Button>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </Panel>
// // //   )
// // // }

// // import { Avatar, Progress, Loader, Panel, Tag } from 'rsuite'
// // import { BsPersonFill, BsDownload, BsFilePdf, BsFileEarmarkExcel } from 'react-icons/bs'
// // import { useRef } from 'react'
// // import { Whisper, Popover, IconButton } from 'rsuite'
// // import './EfficientEmployees.css'

// // function filterLabel(calFilter) {
// //   if (!calFilter?.dates?.length) return null
// //   const { dates, type } = calFilter
// //   if (type === 'today')    return 'Today'
// //   if (type === 'tomorrow') return 'Tomorrow'
// //   if (type === 'last7')    return 'Last 7 Days'
// //   if (dates.length === 1)
// //     return dates[0].toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
// //   return `${dates.length} days`
// // }

// // function DownloadDropdown({ onPDF, onExcel, disabled }) {
// //   const triggerRef = useRef(null)
// //   const speaker = (
// //     <Popover className="dl-popover" arrow={false}>
// //       <div className="dl-menu">
// //         <button className="dl-item dl-item-pdf"
// //           onClick={() => { triggerRef.current?.close(); onPDF?.() }}>
// //           <BsFilePdf size={14} /><span>Download PDF</span>
// //         </button>
// //         <button className="dl-item dl-item-excel"
// //           onClick={() => { triggerRef.current?.close(); onExcel?.() }}>
// //           <BsFileEarmarkExcel size={14} /><span>Download Excel</span>
// //         </button>
// //       </div>
// //     </Popover>
// //   )
// //   return (
// //     <Whisper ref={triggerRef} placement="bottomEnd" trigger="click" speaker={speaker}>
// //       <IconButton
// //         icon={<BsDownload size={13} />}
// //         size="xs" appearance="subtle"
// //         disabled={disabled}
// //         title="Download report"
// //         className="dl-trigger-btn"
// //       />
// //     </Whisper>
// //   )
// // }

// // export default function EfficientEmployees({ data, loading, error, calFilter, onDownloadPDF, onDownloadExcel }) {
// //   const label = filterLabel(calFilter)
// //   const list  = data?.employees ?? []

// //   const header = (
// //     <div className="eff-header-container">
// //       <div className="eff-title-wrap">
// //         <BsPersonFill size={13} className="eff-title-icon" />
// //         <span className="eff-title">Efficient Employees</span>
// //       </div>
// //       <div className="eff-header-right">
// //         {label && (
// //           <Tag color="blue" style={{ fontSize:10, fontWeight:600 }}>{label}</Tag>
// //         )}
// //         <DownloadDropdown
// //           onPDF={onDownloadPDF}
// //           onExcel={onDownloadExcel}
// //           disabled={loading || !list.length}
// //         />
// //       </div>
// //     </div>
// //   )

// //   if (loading) return (
// //     <Panel header={header} className="eff-emp-panel">
// //       <div className="eff-loading"><Loader size="sm" content="Loading..." /></div>
// //     </Panel>
// //   )

// //   if (error || !data) return (
// //     <Panel header={header} className="eff-emp-panel">
// //       <div className="eff-loading">No data</div>
// //     </Panel>
// //   )

// //   return (
// //     <Panel header={header} className="eff-emp-panel">
// //       <div className="eff-list-wrapper">
// //         <div className="eff-list">
// //           {list.length > 0 ? (
// //             list.map((emp, i) => {
// //               const pct = Math.round((emp.score / emp.maxScore) * 100)
// //               return (
// //                 <div key={emp.empId} className="eff-row">
// //                   <span className="eff-rank">{i + 1}.</span>
// //                   <Avatar
// //                     circle size="sm"
// //                     src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.empId}`}
// //                     style={{ flexShrink: 0 }}
// //                   />
// //                   <div className="eff-info">
// //                     <span className="eff-name">{emp.name}</span>
// //                     <span className="eff-id">ID: {emp.empId}</span>
// //                   </div>
// //                   <div className="eff-bar-wrap">
// //                     <Progress.Line
// //                       percent={pct} strokeWidth={5} showInfo={false}
// //                       strokeColor="var(--accent)" style={{ padding:0 }}
// //                     />
// //                   </div>
// //                   <span className="eff-score">{emp.score}/{emp.maxScore}</span>
// //                 </div>
// //               )
// //             })
// //           ) : (
// //             <div className="eff-loading">No employees</div>
// //           )}
// //         </div>
// //       </div>
// //     </Panel>
// //   )
// // }

// import { Avatar, Progress, Loader, Panel, Tag, Whisper, Popover, IconButton } from 'rsuite'
// import { BsPersonFill, BsDownload, BsFilePdf, BsFileEarmarkExcel } from 'react-icons/bs'
// import { useRef } from 'react'
// import './EfficientEmployees.css'

// /**
//  * Get display label for calendar filter
//  */
// function filterLabel(calFilter) {
//   if (!calFilter?.dates?.length) return null
//   const { dates, type } = calFilter
  
//   if (type === 'today') return 'Today'
//   if (type === 'tomorrow') return 'Tomorrow'
//   if (type === 'last7') return 'Last 7 Days'
  
//   if (dates.length === 1) {
//     return dates[0].toLocaleDateString('en-GB', { 
//       day: '2-digit', 
//       month: 'short', 
//       year: 'numeric' 
//     })
//   }
  
//   return `${dates.length} days`
// }

// /**
//  * Download dropdown menu component
//  */
// function DownloadDropdown({ onPDF, onExcel, disabled }) {
//   const triggerRef = useRef(null)
  
//   const speaker = (
//     <Popover className="dl-popover" arrow={false}>
//       <div className="dl-menu">
//         <button 
//           className="dl-item dl-item-pdf"
//           onClick={() => { 
//             triggerRef.current?.close()
//             onPDF?.() 
//           }}
//           disabled={disabled}
//         >
//           <BsFilePdf size={14} />
//           <span>Download PDF</span>
//         </button>
//         <button 
//           className="dl-item dl-item-excel"
//           onClick={() => { 
//             triggerRef.current?.close()
//             onExcel?.() 
//           }}
//           disabled={disabled}
//         >
//           <BsFileEarmarkExcel size={14} />
//           <span>Download Excel</span>
//         </button>
//       </div>
//     </Popover>
//   )
  
//   return (
//     <Whisper ref={triggerRef} placement="bottomEnd" trigger="click" speaker={speaker}>
//       <IconButton
//         icon={<BsDownload size={13} />}
//         size="xs" 
//         appearance="subtle"
//         disabled={disabled}
//         title="Download report"
//         className="dl-trigger-btn"
//       />
//     </Whisper>
//   )
// }

// /**
//  * Efficient Employees Component
//  * 
//  * Displays a ranked list of employees based on their efficiency scores
//  * 
//  * @param {Object} data - Employee data { employees: [{empId, name, score, maxScore}] }
//  * @param {boolean} loading - Loading state
//  * @param {string|null} error - Error message
//  * @param {Object} calFilter - Calendar filter { dates: Date[], type: string }
//  * @param {Function} onDownloadPDF - Callback for PDF download
//  * @param {Function} onDownloadExcel - Callback for Excel download
//  */
// export default function EfficientEmployees({ 
//   data, 
//   loading, 
//   error, 
//   calFilter, 
//   onDownloadPDF, 
//   onDownloadExcel 
// }) {
//   const label = filterLabel(calFilter)
//   const list = data?.employees ?? []

//   // Panel header
//   const header = (
//     <div className="eff-header-container">
//       <div className="eff-title-wrap">
//         <BsPersonFill size={13} className="eff-title-icon" />
//         <span className="eff-title">Efficient Employees</span>
//       </div>
//       <div className="eff-header-right">
//         {label && (
//           <Tag color="blue" style={{ fontSize: 10, fontWeight: 600 }}>
//             {label}
//           </Tag>
//         )}
//         <DownloadDropdown
//           onPDF={onDownloadPDF}
//           onExcel={onDownloadExcel}
//           disabled={loading || !list.length}
//         />
//       </div>
//     </div>
//   )

//   // Loading state
//   if (loading) {
//     return (
//       <Panel header={header} className="eff-emp-panel">
//         <div className="eff-loading">
//           <Loader size="sm" content="Loading..." />
//         </div>
//       </Panel>
//     )
//   }

//   // Error state
//   if (error || !data) {
//     return (
//       <Panel header={header} className="eff-emp-panel">
//         <div className="eff-loading">
//           {error || 'No data available'}
//         </div>
//       </Panel>
//     )
//   }

//   // Main render
//   return (
//     <Panel header={header} className="eff-emp-panel">
//       <div className="eff-list-wrapper">
//         <div className="eff-list">
//           {list.length > 0 ? (
//             list.map((emp, i) => {
//               const pct = Math.round((emp.score / emp.maxScore) * 100)
              
//               return (
//                 <div key={emp.empId} className="eff-row">
//                   {/* Rank */}
//                   <span className="eff-rank">{i + 1}.</span>
                  
//                   {/* Avatar — initials only, no external image */}
//                   <Avatar
//                     circle
//                     size="sm"
//                     style={{
//                       flexShrink: 0,
//                       background: `hsl(${(emp.empId?.toString().split('').reduce((a,c)=>a+c.charCodeAt(0),0)??0)%360},60%,50%)`,
//                       color: '#fff',
//                       fontSize: 11,
//                       fontWeight: 700,
//                     }}
//                   >
//                     {(emp.name ?? '?').charAt(0).toUpperCase()}
//                   </Avatar>
                  
//                   {/* Employee Info */}
//                   <div className="eff-info">
//                     <span className="eff-name">{emp.name}</span>
//                     <span className="eff-id">ID: {emp.empId}</span>
//                   </div>
                  
//                   {/* Progress Bar */}
//                   <div className="eff-bar-wrap">
//                     <Progress.Line
//                       percent={pct} 
//                       strokeWidth={5} 
//                       showInfo={false}
//                       strokeColor="var(--accent)" 
//                       style={{ padding: 0 }}
//                     />
//                   </div>
                  
//                   {/* Score */}
//                   <span className="eff-score">
//                     {emp.score}/{emp.maxScore}
//                   </span>
//                 </div>
//               )
//             })
//           ) : (
//             <div className="eff-loading">No employees</div>
//           )}
//         </div>
//       </div>
//     </Panel>
//   )
// }

// // // import { useState } from 'react'
// // // import { Avatar, Progress, Loader, Panel, Button } from 'rsuite'
// // // import './EfficientEmployees.css'

// // // export default function EfficientEmployees({ data, loading, error }) {
// // //   const [showAll, setShowAll] = useState(false)
// // //   const INITIAL_DISPLAY = 5

// // //   // Create header content function so it updates with showAll state
// // //   const createHeaderContent = () => (
// // //     <div className="eff-header-container">
// // //       <span className="eff-title">Efficient employee's</span>
// // //       {data?.employees?.length > INITIAL_DISPLAY && (
// // //         <Button 
// // //           appearance="link"
// // //           size="sm"
// // //           onClick={() => setShowAll(!showAll)}
// // //           className="eff-see-more-btn"
// // //         >
// // //           {showAll ? 'Show less' : 'See more'}
// // //         </Button>
// // //       )}
// // //     </div>
// // //   )

// // //   if (loading) return (
// // //     <Panel header={createHeaderContent()} className="eff-emp-panel">
// // //       <div className="eff-loading"><Loader size="sm" content="Loading..." /></div>
// // //     </Panel>
// // //   )

// // //   if (error || !data) return (
// // //     <Panel header={createHeaderContent()} className="eff-emp-panel">
// // //       <div className="eff-loading">No data</div>
// // //     </Panel>
// // //   )

// // //   const list = data.employees || []
// // //   const displayedList = showAll ? list : list.slice(0, INITIAL_DISPLAY)

// // //   return (
// // //     <Panel header={createHeaderContent()} className="eff-emp-panel">
// // //       <div className={`eff-list-wrapper${showAll ? ' eff-list-expanded' : ''}`}>
// // //         <div className="eff-list">
// // //           {displayedList.length > 0 ? (
// // //             displayedList.map((emp, i) => {
// // //               const pct = Math.round((emp.score / emp.maxScore) * 100)
// // //               return (
// // //                 <div key={emp.empId} className="eff-row">
// // //                   <span className="eff-rank">{i+1}.</span>
// // //                   <Avatar
// // //                     circle
// // //                     size="sm"
// // //                     src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.empId}`}
// // //                     style={{ flexShrink: 0 }}
// // //                   />
// // //                   <div className="eff-info">
// // //                     <span className="eff-name">{emp.name}</span>
// // //                     <span className="eff-id">ID: {emp.empId}</span>
// // //                   </div>
// // //                   <div className="eff-bar-wrap">
// // //                     <Progress.Line
// // //                       percent={pct}
// // //                       strokeWidth={5}
// // //                       showInfo={false}
// // //                       strokeColor="var(--accent)"
// // //                       style={{ padding: 0 }}
// // //                     />
// // //                   </div>
// // //                   <span className="eff-score">{emp.score}/{emp.maxScore}</span>
// // //                 </div>
// // //               )
// // //             })
// // //           ) : (
// // //             <div className="eff-loading">No employees</div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </Panel>
// // //   )
// // // }

// // import { useState } from 'react'
// // import { Avatar, Progress, Loader, Panel, Button, Tag } from 'rsuite'
// // import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
// // import './EfficientEmployees.css'

// // const INITIAL_DISPLAY = 5

// // function filterLabel(calFilter) {
// //   if (!calFilter?.dates?.length) return null
// //   const { dates, type } = calFilter
// //   if (type === 'today') return 'Today'
// //   if (type === 'tomorrow') return 'Tomorrow'
// //   if (type === 'last7') return 'Last 7 Days'
// //   if (dates.length === 1)
// //     return dates[0].toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
// //   return `${dates.length} days`
// // }

// // export default function EfficientEmployees({ data, loading, error, calFilter }) {
// //   const [showAll, setShowAll] = useState(false)

// //   const label = filterLabel(calFilter)
// //   const list = data?.employees ?? []
// //   const hasMore = list.length > INITIAL_DISPLAY
// //   const displayed = showAll ? list : list.slice(0, INITIAL_DISPLAY)

// //   const header = (
// //     <div className="eff-header-container">
// //       <span className="eff-title">Efficient Employees</span>
// //       {label && (
// //         <Tag color="blue" style={{ fontSize: 10, fontWeight: 600 }}>
// //           {label}
// //         </Tag>
// //       )}
// //     </div>
// //   )

// //   if (loading) return (
// //     <Panel header={header} className="eff-emp-panel">
// //       <div className="eff-loading"><Loader size="sm" content="Loading..." /></div>
// //     </Panel>
// //   )

// //   if (error || !data) return (
// //     <Panel header={header} className="eff-emp-panel">
// //       <div className="eff-loading">No data</div>
// //     </Panel>
// //   )

// //   return (
// //     <Panel header={header} className="eff-emp-panel">
// //       <div className={`eff-list-wrapper${showAll ? ' eff-list-expanded' : ''}`}>

// //         <div className="eff-list">
// //           {displayed.length > 0 ? (
// //             displayed.map((emp, i) => {
// //               const pct = Math.round((emp.score / emp.maxScore) * 100)
// //               return (
// //                 <div key={emp.empId} className="eff-row">
// //                   <span className="eff-rank">{i + 1}.</span>
// //                   <Avatar
// //                     circle size="sm"
// //                     src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.empId}`}
// //                     style={{ flexShrink: 0 }}
// //                   />
// //                   <div className="eff-info">
// //                     <span className="eff-name">{emp.name}</span>
// //                     <span className="eff-id">ID: {emp.empId}</span>
// //                   </div>
// //                   <div className="eff-bar-wrap">
// //                     <Progress.Line
// //                       percent={pct}
// //                       strokeWidth={5}
// //                       showInfo={false}
// //                       strokeColor="var(--accent)"
// //                       style={{ padding: 0 }}
// //                     />
// //                   </div>
// //                   <span className="eff-score">{emp.score}/{emp.maxScore}</span>
// //                 </div>
// //               )
// //             })
// //           ) : (
// //             <div className="eff-loading">No employees</div>
// //           )}
// //         </div>

// //         {/* View more / Show less — bottom of panel */}
// //         {hasMore && (
// //           <div className="eff-view-more-wrap">
// //             <Button
// //               block
// //               appearance="subtle"
// //               size="sm"
// //               startIcon={showAll ? <BsChevronUp /> : <BsChevronDown />}
// //               onClick={() => setShowAll(v => !v)}
// //               className="eff-view-more-btn"
// //             >
// //               {showAll ? 'Show less' : `View more (${list.length - INITIAL_DISPLAY} more)`}
// //             </Button>
// //           </div>
// //         )}
// //       </div>
// //     </Panel>
// //   )
// // }

// import { Avatar, Progress, Loader, Panel, Tag } from 'rsuite'
// import { BsPersonFill, BsDownload, BsFilePdf, BsFileEarmarkExcel } from 'react-icons/bs'
// import { useRef } from 'react'
// import { Whisper, Popover, IconButton } from 'rsuite'
// import './EfficientEmployees.css'

// function filterLabel(calFilter) {
//   if (!calFilter?.dates?.length) return null
//   const { dates, type } = calFilter
//   if (type === 'today')    return 'Today'
//   if (type === 'tomorrow') return 'Tomorrow'
//   if (type === 'last7')    return 'Last 7 Days'
//   if (dates.length === 1)
//     return dates[0].toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
//   return `${dates.length} days`
// }

// function DownloadDropdown({ onPDF, onExcel, disabled }) {
//   const triggerRef = useRef(null)
//   const speaker = (
//     <Popover className="dl-popover" arrow={false}>
//       <div className="dl-menu">
//         <button className="dl-item dl-item-pdf"
//           onClick={() => { triggerRef.current?.close(); onPDF?.() }}>
//           <BsFilePdf size={14} /><span>Download PDF</span>
//         </button>
//         <button className="dl-item dl-item-excel"
//           onClick={() => { triggerRef.current?.close(); onExcel?.() }}>
//           <BsFileEarmarkExcel size={14} /><span>Download Excel</span>
//         </button>
//       </div>
//     </Popover>
//   )
//   return (
//     <Whisper ref={triggerRef} placement="bottomEnd" trigger="click" speaker={speaker}>
//       <IconButton
//         icon={<BsDownload size={13} />}
//         size="xs" appearance="subtle"
//         disabled={disabled}
//         title="Download report"
//         className="dl-trigger-btn"
//       />
//     </Whisper>
//   )
// }

// export default function EfficientEmployees({ data, loading, error, calFilter, onDownloadPDF, onDownloadExcel }) {
//   const label = filterLabel(calFilter)
//   const list  = data?.employees ?? []

//   const header = (
//     <div className="eff-header-container">
//       <div className="eff-title-wrap">
//         <BsPersonFill size={13} className="eff-title-icon" />
//         <span className="eff-title">Efficient Employees</span>
//       </div>
//       <div className="eff-header-right">
//         {label && (
//           <Tag color="blue" style={{ fontSize:10, fontWeight:600 }}>{label}</Tag>
//         )}
//         <DownloadDropdown
//           onPDF={onDownloadPDF}
//           onExcel={onDownloadExcel}
//           disabled={loading || !list.length}
//         />
//       </div>
//     </div>
//   )

//   if (loading) return (
//     <Panel header={header} className="eff-emp-panel">
//       <div className="eff-loading"><Loader size="sm" content="Loading..." /></div>
//     </Panel>
//   )

//   if (error || !data) return (
//     <Panel header={header} className="eff-emp-panel">
//       <div className="eff-loading">No data</div>
//     </Panel>
//   )

//   return (
//     <Panel header={header} className="eff-emp-panel">
//       <div className="eff-list-wrapper">
//         <div className="eff-list">
//           {list.length > 0 ? (
//             list.map((emp, i) => {
//               const pct = Math.round((emp.score / emp.maxScore) * 100)
//               return (
//                 <div key={emp.empId} className="eff-row">
//                   <span className="eff-rank">{i + 1}.</span>
//                   <Avatar
//                     circle size="sm"
//                     src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.empId}`}
//                     style={{ flexShrink: 0 }}
//                   />
//                   <div className="eff-info">
//                     <span className="eff-name">{emp.name}</span>
//                     <span className="eff-id">ID: {emp.empId}</span>
//                   </div>
//                   <div className="eff-bar-wrap">
//                     <Progress.Line
//                       percent={pct} strokeWidth={5} showInfo={false}
//                       strokeColor="var(--accent)" style={{ padding:0 }}
//                     />
//                   </div>
//                   <span className="eff-score">{emp.score}/{emp.maxScore}</span>
//                 </div>
//               )
//             })
//           ) : (
//             <div className="eff-loading">No employees</div>
//           )}
//         </div>
//       </div>
//     </Panel>
//   )
// }

import { Avatar, Progress, Loader, Panel, Tag, Whisper, Popover, IconButton } from 'rsuite'
import { BsPersonFill, BsDownload, BsFilePdf, BsFileEarmarkExcel } from 'react-icons/bs'
import { useRef } from 'react'
import './EfficientEmployees.css'

/* ── Professional light-theme PDF generator ─────────────────── */
function generatePDF(list, label) {
  const now     = new Date()
  const dateStr = now.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
  const timeStr = now.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })

  const getGrade = pct => pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D'
  const getPctColor = pct => pct >= 80 ? '#16a34a' : pct >= 60 ? '#f97316' : '#dc2626'
  const getBarColor = pct => pct >= 80 ? '#16a34a' : pct >= 60 ? '#f97316' : '#dc2626'

  /* ── Top-3 summary cards ── */
  const cardBorders  = ['#f59e0b', '#6b7280', '#b45309']
  const cardBadgeBgs = ['#f59e0b', '#6b7280', '#b45309']
  const rankLabels   = ['#1','#2','#3']

  const summaryCards = list.slice(0, 3).map((emp, i) => {
    const pct = Math.round((emp.score / emp.maxScore) * 100)
    return `
    <div style="background:#fff;border:2px solid ${cardBorders[i]};border-radius:10px;
      padding:18px 20px;min-width:0;">
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px;">
        <div style="background:${cardBadgeBgs[i]};color:#fff;font-weight:800;font-size:14px;
          padding:6px 10px;border-radius:7px;flex-shrink:0;">${rankLabels[i]}</div>
        <div>
          <div style="font-size:16px;font-weight:800;color:#1a2535;">${emp.name}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">ID: ${emp.empId}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
        <span style="font-size:22px;font-weight:800;color:${cardBorders[i]};">${emp.score}/${emp.maxScore}</span>
        <span style="font-size:13px;color:#6b7280;">${pct}%</span>
      </div>
      <div style="width:100%;height:6px;background:#e5e7eb;border-radius:3px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:${cardBorders[i]};border-radius:3px;"></div>
      </div>
    </div>`
  }).join('')

  /* ── Table rows ── */
  const tableRows = list.map((emp, i) => {
    const pct       = Math.round((emp.score / emp.maxScore) * 100)
    const grade     = getGrade(pct)
    const pctColor  = getPctColor(pct)
    const barColor  = getBarColor(pct)
    const rankStyle = i < 3
      ? `background:${cardBadgeBgs[i]};color:#fff;font-weight:800;border-radius:5px;padding:3px 8px;`
      : `color:#374151;font-weight:600;`
    const rowBg = i % 2 === 0 ? '#ffffff' : '#f9fafb'
    return `
    <tr style="background:${rowBg};border-bottom:1px solid #e5e7eb;">
      <td style="padding:11px 14px;text-align:center;">
        <span style="${rankStyle}">${i + 1}</span>
      </td>
      <td style="padding:11px 14px;font-size:12.5px;color:#374151;">${emp.empId}</td>
      <td style="padding:11px 14px;font-size:12.5px;font-weight:600;color:#1a2535;">${emp.name}</td>
      <td style="padding:11px 14px;text-align:center;font-size:12.5px;color:#374151;">${emp.score}</td>
      <td style="padding:11px 14px;text-align:center;font-size:12.5px;color:#374151;">${emp.maxScore}</td>
      <td style="padding:11px 14px;text-align:center;">
        <span style="font-weight:800;font-size:13px;color:${pctColor};">${pct}%</span>
      </td>
      <td style="padding:11px 14px;text-align:center;font-size:12.5px;font-weight:700;color:#374151;">${grade}</td>
      <td style="padding:11px 20px;min-width:130px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="flex:1;height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:${barColor};border-radius:4px;"></div>
          </div>
        </div>
      </td>
    </tr>`
  }).join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Efficient Employees Report</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f3f4f6;color:#1a2535;}
    @media print{
      body{background:#fff;}
      .no-print{display:none!important;}
      .page{box-shadow:none;border-radius:0;}
    }
  </style>
</head>
<body>
  <div class="page" style="max-width:960px;margin:0 auto;background:#fff;
    box-shadow:0 0 40px rgba(0,0,0,0.08);min-height:100vh;">

    <!-- Blue header banner -->
    <div style="background:#4a6cf7;padding:22px 32px;">
      <div style="font-size:24px;font-weight:800;color:#fff;letter-spacing:0.5px;text-transform:uppercase;">
        Efficient Employees Report
      </div>
      <div style="font-size:12px;color:rgba(255,255,255,0.8);margin-top:4px;">
        Generated: ${dateStr}, ${timeStr}
      </div>
    </div>

    <!-- Meta info bar -->
    <div style="background:#f8fafc;border-bottom:1px solid #e5e7eb;
      padding:12px 32px;display:flex;align-items:center;gap:24px;">
      <span style="font-size:13px;font-weight:700;color:#374151;">
        Date: ${dateStr}
      </span>
      <span style="color:#d1d5db;">|</span>
      <span style="font-size:13px;font-weight:700;color:#374151;">
        ${label ? `Filter: ${label}` : 'Unit: All'}
      </span>
      <span style="color:#d1d5db;">|</span>
      <span style="font-size:13px;font-weight:700;color:#374151;">
        Employees: ${list.length}
      </span>
    </div>

    <div style="padding:24px 32px;">

      <!-- Top 3 summary cards -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px;">
        ${summaryCards}
      </div>

      <!-- Full table -->
      <div style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#4a6cf7;">
              <th style="padding:12px 14px;text-align:center;color:#fff;font-weight:700;font-size:12px;">Rank</th>
              <th style="padding:12px 14px;text-align:left;color:#fff;font-weight:700;font-size:12px;">Employee ID</th>
              <th style="padding:12px 14px;text-align:left;color:#fff;font-weight:700;font-size:12px;">Employee Name</th>
              <th style="padding:12px 14px;text-align:center;color:#fff;font-weight:700;font-size:12px;">Score</th>
              <th style="padding:12px 14px;text-align:center;color:#fff;font-weight:700;font-size:12px;">Max</th>
              <th style="padding:12px 14px;text-align:center;color:#fff;font-weight:700;font-size:12px;">Efficiency</th>
              <th style="padding:12px 14px;text-align:center;color:#fff;font-weight:700;font-size:12px;">Grade</th>
              <th style="padding:12px 20px;text-align:left;color:#fff;font-weight:700;font-size:12px;">Performance</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>

      <!-- Footer -->
      <div style="margin-top:20px;text-align:center;font-size:11px;color:#9ca3af;">
        Efficient Employees Report · ${dateStr}
      </div>

      <!-- Print button -->
      <div class="no-print" style="margin-top:20px;text-align:center;">
        <button onclick="window.print()" style="background:#4a6cf7;color:#fff;border:none;
          padding:10px 32px;border-radius:8px;font-size:13px;font-weight:700;
          cursor:pointer;letter-spacing:0.3px;">
          🖨️ Print / Save as PDF
        </button>
      </div>
    </div>
  </div>
</body>
</html>`

  const win = window.open('', '_blank', 'width=1000,height=750')
  win.document.write(html)
  win.document.close()
}

/* ── Excel/CSV generator ─────────────────────────────────────── */
function generateExcel(list, label) {
  const header = ['Rank','Employee Name','Employee ID','Score','Max Score','Percentage']
  const rows   = list.map((emp, i) => [
    i + 1,
    emp.name ?? '',
    emp.empId ?? '',
    emp.score ?? 0,
    emp.maxScore ?? 100,
    `${Math.round((emp.score / emp.maxScore) * 100)}%`,
  ])
  const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), {
    href: url,
    download: `Efficient_Employees_Report_${new Date().toISOString().slice(0,10)}.xls`,
  })
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Get display label for calendar filter
 */
function filterLabel(calFilter) {
  if (!calFilter?.dates?.length) return null
  const { dates, type } = calFilter
  
  if (type === 'today') return 'Today'
  if (type === 'tomorrow') return 'Tomorrow'
  if (type === 'last7') return 'Last 7 Days'
  
  if (dates.length === 1) {
    return dates[0].toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
  }
  
  return `${dates.length} days`
}

/**
 * Download dropdown menu component
 */
function DownloadDropdown({ onPDF, onExcel, disabled }) {
  const triggerRef = useRef(null)
  
  const speaker = (
    <Popover className="dl-popover" arrow={false}>
      <div className="dl-menu">
        <button 
          className="dl-item dl-item-pdf"
          onClick={() => { 
            triggerRef.current?.close()
            onPDF?.() 
          }}
          disabled={disabled}
        >
          <BsFilePdf size={14} />
          <span>Download PDF</span>
        </button>
        <button 
          className="dl-item dl-item-excel"
          onClick={() => { 
            triggerRef.current?.close()
            onExcel?.() 
          }}
          disabled={disabled}
        >
          <BsFileEarmarkExcel size={14} />
          <span>Download Excel</span>
        </button>
      </div>
    </Popover>
  )
  
  return (
    <Whisper ref={triggerRef} placement="bottomEnd" trigger="click" speaker={speaker}>
      <IconButton
        icon={<BsDownload size={13} />}
        size="xs" 
        appearance="subtle"
        disabled={disabled}
        title="Download report"
        className="dl-trigger-btn"
      />
    </Whisper>
  )
}

/**
 * Efficient Employees Component
 * 
 * Displays a ranked list of employees based on their efficiency scores
 * 
 * @param {Object} data - Employee data { employees: [{empId, name, score, maxScore}] }
 * @param {boolean} loading - Loading state
 * @param {string|null} error - Error message
 * @param {Object} calFilter - Calendar filter { dates: Date[], type: string }
 * @param {Function} onDownloadPDF - Callback for PDF download
 * @param {Function} onDownloadExcel - Callback for Excel download
 */
export default function EfficientEmployees({ 
  data, 
  loading, 
  error, 
  calFilter, 
  onDownloadPDF, 
  onDownloadExcel 
}) {
  const label = filterLabel(calFilter)
  const list  = data?.employees ?? []

  const handlePDF   = () => generatePDF(list, label)
  const handleExcel = () => generateExcel(list, label)

  // Panel header
  const header = (
    <div className="eff-header-container">
      <div className="eff-title-wrap">
        <BsPersonFill size={13} className="eff-title-icon" />
        <span className="eff-title">Efficient Employees</span>
      </div>
      <div className="eff-header-right">
        {label && (
          <Tag color="blue" style={{ fontSize: 10, fontWeight: 600 }}>
            {label}
          </Tag>
        )}
        <DownloadDropdown
          onPDF={handlePDF}
          onExcel={handleExcel}
          disabled={loading || !list.length}
        />
      </div>
    </div>
  )

  // Loading state
  if (loading) {
    return (
      <Panel header={header} className="eff-emp-panel">
        <div className="eff-loading">
          <Loader size="sm" content="Loading..." />
        </div>
      </Panel>
    )
  }

  // Error state
  if (error || !data) {
    return (
      <Panel header={header} className="eff-emp-panel">
        <div className="eff-loading">
          {error || 'No data available'}
        </div>
      </Panel>
    )
  }

  // Main render
  return (
    <Panel header={header} className="eff-emp-panel">
      <div className="eff-list-wrapper">
        <div className="eff-list">
          {list.length > 0 ? (
            list.map((emp, i) => {
              const pct = Math.round((emp.score / emp.maxScore) * 100)
              
              return (
                <div key={emp.empId} className="eff-row">
                  {/* Rank */}
                  <span className="eff-rank">{i + 1}.</span>
                  
                  {/* Avatar — initials only, no external image */}
                  <Avatar
                    circle
                    size="sm"
                    style={{
                      flexShrink: 0,
                      background: `hsl(${(emp.empId?.toString().split('').reduce((a,c)=>a+c.charCodeAt(0),0)??0)%360},60%,50%)`,
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {(emp.name ?? '?').charAt(0).toUpperCase()}
                  </Avatar>
                  
                  {/* Employee Info */}
                  <div className="eff-info">
                    <span className="eff-name">{emp.name}</span>
                    <span className="eff-id">ID: {emp.empId}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="eff-bar-wrap">
                    <Progress.Line
                      percent={pct} 
                      strokeWidth={5} 
                      showInfo={false}
                      strokeColor="var(--accent)" 
                      style={{ padding: 0 }}
                    />
                  </div>
                  
                  {/* Score */}
                  <span className="eff-score">
                    {emp.score}/{emp.maxScore}
                  </span>
                </div>
              )
            })
          ) : (
            <div className="eff-loading">No employees</div>
          )}
        </div>
      </div>
    </Panel>
  )
}