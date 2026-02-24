// ─── DUMMY PATROL DATA ───────────────────────────────────────────────────────
// Each patrol has different data so you can easily test selection.
// Media arrays hold online-accessible dummy URLs.

export const DUMMY_TRIP_DETAIL = {
  employeeName: 'Karthik',
  employeeId:   'EMP-1234',
  cycleDone:    6,
  cycleTotal:   11,
  checkpointsDone:  4,
  checkpointsTotal: 6,
  orderTrip: 'Order Trip →',
  tripDoneOf: 7,
  tripTotal:  11,
  tripPoints: [
    { id:'tp1', name:'Gate A',    time:'09:05 AM', checkpoints:3, status:'Complete', stats:[1,2,0,1] },
    { id:'tp2', name:'Block B',   time:'09:45 AM', checkpoints:2, status:'Complete', stats:[0,1,1,0] },
    { id:'tp3', name:'Zone C',    time:'10:20 AM', checkpoints:4, status:'Ongoing',  stats:[1,0,2,1] },
    { id:'tp4', name:'Parking D', time:'11:00 AM', checkpoints:1, status:'Upcoming', stats:[0,0,0,0] },
  ],

  patrols: [
    {
      id: 'p1',
      name:        'Patrol Area — North Wing',
      timeFrom:    '08:00 AM',
      timeTo:      '10:00 AM',
      loginStatus: 'On-time',
      rounds:       6,
      checkpoints:  11,
      status:       'Ongoing',
      // Media counts shown under icons
      media: {
        voice:  [
          { id:'v1', label:'Voice Note 1', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration:'0:42' },
        ],
        photo:  [
          { id:'ph1', label:'Photo 1', url:'https://picsum.photos/seed/patrol1a/400/300', thumb:'https://picsum.photos/seed/patrol1a/80/60' },
          { id:'ph2', label:'Photo 2', url:'https://picsum.photos/seed/patrol1b/400/300', thumb:'https://picsum.photos/seed/patrol1b/80/60' },
          { id:'ph3', label:'Photo 3', url:'https://picsum.photos/seed/patrol1c/400/300', thumb:'https://picsum.photos/seed/patrol1c/80/60' },
        ],
        video:  [
          { id:'vid1', label:'Clip 1', url:'https://www.w3schools.com/html/mov_bbb.mp4', thumb:'https://picsum.photos/seed/vid1/80/60' },
          { id:'vid2', label:'Clip 2', url:'https://www.w3schools.com/html/movie.mp4',   thumb:'https://picsum.photos/seed/vid2/80/60' },
        ],
        message:[
          { id:'m1', label:'Message 1', text:'All clear at north entry.',    time:'08:12 AM' },
          { id:'m2', label:'Message 2', text:'Found suspicious package.',    time:'08:55 AM' },
          { id:'m3', label:'Message 3', text:'Called backup — situation OK.',time:'09:30 AM' },
          { id:'m4', label:'Message 4', text:'Patrol completed.',            time:'09:58 AM' },
        ],
        report: [
          { id:'r1', label:'Shift Report',  text:'North Wing patrol: no incidents. 6 rounds completed on schedule.', time:'10:01 AM' },
          { id:'r2', label:'Hazard Log',    text:'Loose cable near stairwell B. Reported to maintenance.',           time:'09:22 AM' },
          { id:'r3', label:'Visitor Log',   text:'2 visitors signed in at 08:30 AM, signed out 09:15 AM.',          time:'09:15 AM' },
          { id:'r4', label:'Incident Note', text:'Minor scuffle near vending machines — resolved.',                  time:'08:47 AM' },
        ],
      },
    },

    {
      id: 'p2',
      name:        'Patrol Area — South Gate',
      timeFrom:    '10:00 AM',
      timeTo:      '12:00 PM',
      loginStatus: 'Late',
      rounds:       4,
      checkpoints:  8,
      status:       'Complete',
      media: {
        voice:  [
          { id:'v1', label:'Check-in Audio', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration:'1:05' },
          { id:'v2', label:'Incident Report Audio', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration:'0:28' },
          { id:'v3', label:'End-of-shift Note', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration:'0:55' },
        ],
        photo:  [
          { id:'ph1', label:'South Gate Entry', url:'https://picsum.photos/seed/patrol2a/400/300', thumb:'https://picsum.photos/seed/patrol2a/80/60' },
        ],
        video:  [],
        message:[
          { id:'m1', label:'Message 1', text:'Arrived at south gate — delay due to traffic.', time:'10:08 AM' },
          { id:'m2', label:'Message 2', text:'Gate sealed. Beginning rounds.',               time:'10:15 AM' },
        ],
        report: [
          { id:'r1', label:'Completion Report', text:'South Gate patrol complete. 4 rounds. Gate locked at 11:58 AM.', time:'11:58 AM' },
          { id:'r2', label:'Late Arrival Note', text:'Arrived 8 min late due to traffic — noted.',                    time:'10:09 AM' },
          { id:'r3', label:'Maintenance Request',text:'Street light #4 flickering — submitted work order.',           time:'11:20 AM' },
        ],
      },
    },

    {
      id: 'p3',
      name:        'Patrol Area — East Block',
      timeFrom:    '12:00 PM',
      timeTo:      '02:00 PM',
      loginStatus: 'On-time',
      rounds:       5,
      checkpoints:  9,
      status:       'Complete',
      media: {
        voice:  [
          { id:'v1', label:'Noon Check-in', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', duration:'0:33' },
          { id:'v2', label:'Anomaly Report', url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', duration:'1:12' },
        ],
        photo:  [
          { id:'ph1', label:'East Block Entrance', url:'https://picsum.photos/seed/patrol3a/400/300', thumb:'https://picsum.photos/seed/patrol3a/80/60' },
          { id:'ph2', label:'Damaged Fence',       url:'https://picsum.photos/seed/patrol3b/400/300', thumb:'https://picsum.photos/seed/patrol3b/80/60' },
          { id:'ph3', label:'CCTV Check',          url:'https://picsum.photos/seed/patrol3c/400/300', thumb:'https://picsum.photos/seed/patrol3c/80/60' },
          { id:'ph4', label:'Storage Room',        url:'https://picsum.photos/seed/patrol3d/400/300', thumb:'https://picsum.photos/seed/patrol3d/80/60' },
        ],
        video:  [
          { id:'vid1', label:'Perimeter Clip', url:'https://www.w3schools.com/html/mov_bbb.mp4', thumb:'https://picsum.photos/seed/vid3/80/60' },
          { id:'vid2', label:'Fence Damage',   url:'https://www.w3schools.com/html/movie.mp4',   thumb:'https://picsum.photos/seed/vid4/80/60' },
          { id:'vid3', label:'Storage Check',  url:'https://www.w3schools.com/html/mov_bbb.mp4', thumb:'https://picsum.photos/seed/vid5/80/60' },
        ],
        message:[
          { id:'m1', label:'Message 1', text:'Fence damage spotted — east side.',  time:'12:45 PM' },
          { id:'m2', label:'Message 2', text:'Maintenance notified.',               time:'12:48 PM' },
          { id:'m3', label:'Message 3', text:'Rounds complete.',                    time:'01:55 PM' },
        ],
        report: [
          { id:'r1', label:'Patrol Report',  text:'East Block: 5 rounds done. Fence damage on east perimeter reported.', time:'02:00 PM' },
          { id:'r2', label:'Damage Report',  text:'Section E-4 fence broken — needs urgent repair.',                     time:'12:50 PM' },
        ],
      },
    },

    {
      id: 'p4',
      name:        'Patrol Area — West Perimeter',
      timeFrom:    '02:00 PM',
      timeTo:      '04:00 PM',
      loginStatus: 'On-time',
      rounds:       3,
      checkpoints:  7,
      status:       'Upcoming',
      media: {
        voice:   [],
        photo:   [],
        video:   [],
        message: [],
        report:  [],
      },
    },
  ],
}