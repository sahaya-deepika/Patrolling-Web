// ─── DUMMY PATROL DATA ───────────────────────────────────────────────────────
// Each patrol has its OWN tripPoints with media data so trip point media
// modals work properly when clicked

export const DUMMY_PATROLS = [
  {
    id: 'p1',
    name:        'Patrol 01 — North Wing',
    timeFrom:    '10:00am',
    timeTo:      '12:00pm',
    loginStatus: 'On-time',
    rounds:       11,
    checkpoints:  11,
    status:       'Ongoing',
    tripDoneOf:   7,
    tripTotal:    11,
    tripPoints: [
      { 
        id:'tp1', 
        name:'Parking area A', 
        time:'10:00am', 
        checkpoints:3, 
        status:'Ongoing',  
        stats:[1,1,0,1],
        media: {
          voice:  [{ id:'v1', label:'Parking Check', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration:'0:35' }],
          photo:  [
            { id:'ph1', label:'Space A-1', url:'https://picsum.photos/seed/park1/400/300', thumb:'https://picsum.photos/seed/park1/80/60' },
            { id:'ph2', label:'Space A-2', url:'https://picsum.photos/seed/park2/400/300', thumb:'https://picsum.photos/seed/park2/80/60' },
          ],
          video:  [{ id:'vid1', label:'Area Scan', url:'https://www.w3schools.com/html/mov_bbb.mp4', thumb:'https://picsum.photos/seed/pv1/80/60' }],
          message:[{ id:'m1', label:'All spaces clear', text:'Parking area A fully cleared.', time:'10:05am' }],
          report: [{ id:'r1', label:'Parking Log', text:'No violations found.', time:'10:00am' }],
        }
      },
      { 
        id:'tp2', 
        name:'Main Gate',      
        time:'10:30am', 
        checkpoints:2, 
        status:'Complete', 
        stats:[0,2,1,0],
        media: {
          voice:  [{ id:'v1', label:'Gate Status', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration:'0:42' }],
          photo:  [
            { id:'ph1', label:'Gate Entry', url:'https://picsum.photos/seed/gate1/400/300', thumb:'https://picsum.photos/seed/gate1/80/60' },
            { id:'ph2', label:'Gate Exit', url:'https://picsum.photos/seed/gate2/400/300', thumb:'https://picsum.photos/seed/gate2/80/60' },
          ],
          video:  [{ id:'vid1', label:'Traffic Flow', url:'https://www.w3schools.com/html/movie.mp4', thumb:'https://picsum.photos/seed/pv2/80/60' }],
          message:[],
          report: [],
        }
      },
      { 
        id:'tp3', 
        name:'Block B Entry',  
        time:'11:00am', 
        checkpoints:4, 
        status:'Complete', 
        stats:[1,0,0,1],
        media: {
          voice:  [],
          photo:  [{ id:'ph1', label:'Entry Door', url:'https://picsum.photos/seed/block1/400/300', thumb:'https://picsum.photos/seed/block1/80/60' }],
          video:  [],
          message:[{ id:'m1', label:'Entry Secured', text:'Block B entry door secured.', time:'11:02am' }],
          report: [{ id:'r1', label:'Block B Log', text:'Entry checkpoint completed.', time:'11:00am' }],
        }
      },
      { 
        id:'tp4', 
        name:'Lobby Area',     
        time:'11:45am', 
        checkpoints:1, 
        status:'Upcoming', 
        stats:[0,0,0,0],
        media: {
          voice:  [],
          photo:  [],
          video:  [],
          message:[],
          report: [],
        }
      },
    ],
    media: {
      voice:  [{ id:'v1', label:'Voice Note 1', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration:'0:42' }],
      photo:  [
        { id:'ph1', label:'North Entry',  url:'https://picsum.photos/seed/p1a/400/300', thumb:'https://picsum.photos/seed/p1a/80/60' },
        { id:'ph2', label:'Corridor B',   url:'https://picsum.photos/seed/p1b/400/300', thumb:'https://picsum.photos/seed/p1b/80/60' },
        { id:'ph3', label:'Gate Closed',  url:'https://picsum.photos/seed/p1c/400/300', thumb:'https://picsum.photos/seed/p1c/80/60' },
      ],
      video:  [
        { id:'vid1', label:'Clip 1', url:'https://www.w3schools.com/html/mov_bbb.mp4', thumb:'https://picsum.photos/seed/pv1/80/60' },
        { id:'vid2', label:'Clip 2', url:'https://www.w3schools.com/html/movie.mp4',   thumb:'https://picsum.photos/seed/pv2/80/60' },
      ],
      message:[
        { id:'m1', label:'Message 1', text:'All clear at north entry.', time:'10:12am' },
        { id:'m2', label:'Message 2', text:'Suspicious package found.', time:'10:55am' },
        { id:'m3', label:'Message 3', text:'Backup called — resolved.', time:'11:30am' },
        { id:'m4', label:'Message 4', text:'Patrol completed.',         time:'11:58am' },
      ],
      report: [
        { id:'r1', label:'Shift Report',   text:'North Wing: 11 rounds, no incidents.', time:'12:00pm' },
        { id:'r2', label:'Hazard Log',     text:'Loose cable near stairwell B.',        time:'11:20am' },
        { id:'r3', label:'Visitor Log',    text:'2 visitors signed in at 10:30am.',     time:'10:30am' },
        { id:'r4', label:'Incident Note',  text:'Minor issue near vending — resolved.', time:'10:47am' },
      ],
    },
  },

  {
    id: 'p2',
    name:        'Patrol 02 — South Gate',
    timeFrom:    '12:00pm',
    timeTo:      '02:00pm',
    loginStatus: 'Late',
    rounds:       8,
    checkpoints:  9,
    status:       'Complete',
    tripDoneOf:   9,
    tripTotal:    9,
    tripPoints: [
      { 
        id:'tp1', 
        name:'South Gate Entry', 
        time:'12:10pm', 
        checkpoints:2, 
        status:'Complete', 
        stats:[0,1,1,0],
        media: {
          voice:  [{ id:'v1', label:'Entry Log', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration:'0:28' }],
          photo:  [
            { id:'ph1', label:'Gate View', url:'https://picsum.photos/seed/south1/400/300', thumb:'https://picsum.photos/seed/south1/80/60' },
          ],
          video:  [{ id:'vid1', label:'Entry Check', url:'https://www.w3schools.com/html/mov_bbb.mp4', thumb:'https://picsum.photos/seed/sv1/80/60' }],
          message:[],
          report: [],
        }
      },
      { 
        id:'tp2', 
        name:'Parking Lot C',    
        time:'12:45pm', 
        checkpoints:3, 
        status:'Complete', 
        stats:[1,1,0,1],
        media: {
          voice:  [],
          photo:  [
            { id:'ph1', label:'Lot Overview', url:'https://picsum.photos/seed/lot1/400/300', thumb:'https://picsum.photos/seed/lot1/80/60' },
            { id:'ph2', label:'Lot Details', url:'https://picsum.photos/seed/lot2/400/300', thumb:'https://picsum.photos/seed/lot2/80/60' },
          ],
          video:  [],
          message:[{ id:'m1', label:'Lot clear', text:'Parking lot C is clear.', time:'12:48pm' }],
          report: [{ id:'r1', label:'Lot Log', text:'3 spaces occupied, rest clear.', time:'12:45pm' }],
        }
      },
      { 
        id:'tp3', 
        name:'Side Fence Row',   
        time:'01:20pm', 
        checkpoints:2, 
        status:'Complete', 
        stats:[0,0,1,0],
        media: {
          voice:  [{ id:'v1', label:'Fence Check', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration:'0:55' }],
          photo:  [],
          video:  [{ id:'vid1', label:'Fence Scan', url:'https://www.w3schools.com/html/movie.mp4', thumb:'https://picsum.photos/seed/sv2/80/60' }],
          message:[],
          report: [],
        }
      },
      { 
        id:'tp4', 
        name:'Guard Post 2',     
        time:'01:50pm', 
        checkpoints:2, 
        status:'Complete', 
        stats:[1,1,1,1],
        media: {
          voice:  [],
          photo:  [{ id:'ph1', label:'Post Check', url:'https://picsum.photos/seed/guard1/400/300', thumb:'https://picsum.photos/seed/guard1/80/60' }],
          video:  [{ id:'vid1', label:'Post Footage', url:'https://www.w3schools.com/html/mov_bbb.mp4', thumb:'https://picsum.photos/seed/sv3/80/60' }],
          message:[{ id:'m1', label:'Post clear', text:'Guard post secured.', time:'01:52pm' }],
          report: [{ id:'r1', label:'Post Log', text:'No incidents.', time:'01:50pm' }],
        }
      },
    ],
    media: {
      voice:  [
        { id:'v1', label:'Check-in Audio',    url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration:'1:05' },
        { id:'v2', label:'Incident Report',   url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration:'0:28' },
        { id:'v3', label:'End-of-shift Note', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration:'0:55' },
      ],
      photo:  [{ id:'ph1', label:'South Gate', url:'https://picsum.photos/seed/p2a/400/300', thumb:'https://picsum.photos/seed/p2a/80/60' }],
      video:  [],
      message:[
        { id:'m1', label:'Message 1', text:'Arrived late — traffic delay.',    time:'12:08pm' },
        { id:'m2', label:'Message 2', text:'Gate sealed. Starting rounds.',    time:'12:15pm' },
      ],
      report: [
        { id:'r1', label:'Completion Report',  text:'South Gate: 8 rounds done. Gate locked.',  time:'01:58pm' },
        { id:'r2', label:'Late Arrival Note',  text:'Arrived 8 min late — noted.',              time:'12:09pm' },
        { id:'r3', label:'Maintenance Req.',   text:'Street light #4 flickering — work order.', time:'01:20pm' },
      ],
    },
  },

  {
    id: 'p3',
    name:        'Patrol 03 — East Block',
    timeFrom:    '02:00pm',
    timeTo:      '04:00pm',
    loginStatus: 'On-time',
    rounds:       5,
    checkpoints:  7,
    status:       'Ongoing',
    tripDoneOf:   4,
    tripTotal:    7,
    tripPoints: [
      { 
        id:'tp1', 
        name:'East Entrance',  
        time:'02:05pm', 
        checkpoints:2, 
        status:'Complete', 
        stats:[1,2,0,0],
        media: {
          voice:  [{ id:'v1', label:'Entry Log', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', duration:'0:33' }],
          photo:  [
            { id:'ph1', label:'Main Entrance', url:'https://picsum.photos/seed/east1/400/300', thumb:'https://picsum.photos/seed/east1/80/60' },
            { id:'ph2', label:'Entrance Side', url:'https://picsum.photos/seed/east2/400/300', thumb:'https://picsum.photos/seed/east2/80/60' },
          ],
          video:  [],
          message:[],
          report: [],
        }
      },
      { 
        id:'tp2', 
        name:'Warehouse Door', 
        time:'02:40pm', 
        checkpoints:3, 
        status:'Ongoing',  
        stats:[0,1,1,1],
        media: {
          voice:  [{ id:'v1', label:'Warehouse Log', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', duration:'1:12' }],
          photo:  [{ id:'ph1', label:'Door Status', url:'https://picsum.photos/seed/warehouse1/400/300', thumb:'https://picsum.photos/seed/warehouse1/80/60' }],
          video:  [{ id:'vid1', label:'Door Check', url:'https://www.w3schools.com/html/movie.mp4', thumb:'https://picsum.photos/seed/wv1/80/60' }],
          message:[{ id:'m1', label:'Door secured', text:'Warehouse door is locked.', time:'02:42pm' }],
          report: [],
        }
      },
      { 
        id:'tp3', 
        name:'Generator Room', 
        time:'03:15pm', 
        checkpoints:1, 
        status:'Upcoming', 
        stats:[0,0,0,0],
        media: {
          voice:  [],
          photo:  [],
          video:  [],
          message:[],
          report: [],
        }
      },
      { 
        id:'tp4', 
        name:'Roof Access',    
        time:'03:45pm', 
        checkpoints:1, 
        status:'Upcoming', 
        stats:[0,0,0,0],
        media: {
          voice:  [],
          photo:  [],
          video:  [],
          message:[],
          report: [],
        }
      },
    ],
    media: {
      voice:  [
        { id:'v1', label:'Noon Check-in',  url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', duration:'0:33' },
        { id:'v2', label:'Anomaly Report', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', duration:'1:12' },
      ],
      photo:  [
        { id:'ph1', label:'East Entrance', url:'https://picsum.photos/seed/p3a/400/300', thumb:'https://picsum.photos/seed/p3a/80/60' },
        { id:'ph2', label:'Damaged Fence', url:'https://picsum.photos/seed/p3b/400/300', thumb:'https://picsum.photos/seed/p3b/80/60' },
        { id:'ph3', label:'CCTV Check',    url:'https://picsum.photos/seed/p3c/400/300', thumb:'https://picsum.photos/seed/p3c/80/60' },
        { id:'ph4', label:'Storage Room',  url:'https://picsum.photos/seed/p3d/400/300', thumb:'https://picsum.photos/seed/p3d/80/60' },
      ],
      video:  [
        { id:'vid1', label:'Perimeter Clip', url:'https://www.w3schools.com/html/mov_bbb.mp4', thumb:'https://picsum.photos/seed/pv3/80/60' },
        { id:'vid2', label:'Fence Damage',   url:'https://www.w3schools.com/html/movie.mp4',   thumb:'https://picsum.photos/seed/pv4/80/60' },
        { id:'vid3', label:'Storage Check',  url:'https://www.w3schools.com/html/mov_bbb.mp4', thumb:'https://picsum.photos/seed/pv5/80/60' },
      ],
      message:[
        { id:'m1', label:'Message 1', text:'Fence damage spotted — east side.', time:'02:45pm' },
        { id:'m2', label:'Message 2', text:'Maintenance notified.',              time:'02:48pm' },
        { id:'m3', label:'Message 3', text:'Continuing rounds.',                 time:'03:10pm' },
      ],
      report: [
        { id:'r1', label:'Patrol Report', text:'East Block: fence damage on east perimeter.', time:'In progress' },
        { id:'r2', label:'Damage Report', text:'Section E-4 fence broken — urgent repair.',   time:'02:50pm'    },
      ],
    },
  },

  {
    id: 'p4',
    name:        'Patrol 04 — West Perimeter',
    timeFrom:    '04:00pm',
    timeTo:      '06:00pm',
    loginStatus: 'On-time',
    rounds:       0,
    checkpoints:  6,
    status:       'Upcoming',
    tripDoneOf:   0,
    tripTotal:    6,
    tripPoints: [
      { 
        id:'tp1', 
        name:'West Gate',      
        time:'04:00pm', 
        checkpoints:2, 
        status:'Upcoming', 
        stats:[0,0,0,0],
        media: { voice:[], photo:[], video:[], message:[], report:[] }
      },
      { 
        id:'tp2', 
        name:'Boundary Wall',  
        time:'04:30pm', 
        checkpoints:2, 
        status:'Upcoming', 
        stats:[0,0,0,0],
        media: { voice:[], photo:[], video:[], message:[], report:[] }
      },
      { 
        id:'tp3', 
        name:'Rear Exit',      
        time:'05:00pm', 
        checkpoints:1, 
        status:'Upcoming', 
        stats:[0,0,0,0],
        media: { voice:[], photo:[], video:[], message:[], report:[] }
      },
      { 
        id:'tp4', 
        name:'Guard Room',     
        time:'05:30pm', 
        checkpoints:1, 
        status:'Upcoming', 
        stats:[0,0,0,0],
        media: { voice:[], photo:[], video:[], message:[], report:[] }
      },
    ],
    media: { voice:[], photo:[], video:[], message:[], report:[] },
  },
]