1. User register 
      2. User Login (jwt, user id (Random)) - player Role initially - Player 
        Subscribe button - IF user subscribe - Role should be Admin
      3. ADMIN can only create MATCH 
          -4 participants -(50rs, 100rs, 200rs, 500rs..)
          -8 participants -(50rs, 100rs, 200rs, 500rs..)
          -16 participants -(50rs, 100rs, 200rs, 500rs..)
        Admin CASE
          post- 1. admin create MATCH Admin will get 
           - match id
           - match timing - eg:6 hrs
        User CASE
          User will get the admin match Room ID 
          - user need to pay to join admin room to play - 50, 100, 200, 500 ...
          - join match - player will get match id via (whatsapp , or some groups)
          -  user enter the admin room participants are adding in the admin room 

       4. if user added user have one id Based on the time he joined the id will add 1, 2, 3  in that room till end.
       5. Admin can see the participants Count if participants are full - admin can announce to start the match
       6. admin can split the particpants user participate with which component player
          -So based on the id 1and 2 will partipate, 3-4 will participate... like that 
          - incase user is out or user not joined Admin came and wait the the time ends admin will terminate that user
          - incase both user (3-4) not joined or not played game amdmin can terminate both , if 1-2 user played and 1 won, so 2,4,5 terminate 1 won the match
       7. in fed we show 1-2 i ll add join match then only 1 and 2 user can see the button.
          -- inside this room they can chat they can share the image they won and loss asedf on the ss or msg admin can decide who won 
          - admin click which user won they will go to next round 
          eg - round of 4 , round of 8 round of 16 
          round of 4 - 3 matches, round of 8 have 7 matchs, round of 16 have 15 matches 
       8.  winner
         - if round of 4 (joined 50-every user means 200 total)
         admin got - 20% - 40rs
         gamex got - 10% - 20rs
         winner got - 70% -140rs


         DAY 1

         - Login, Register, getUser, Wallet , Get wallet - 90% DONE
         - Subscribe - for Admin (Role- admin )

        DAY 2

         - Create Match - Categories 4,8, 16 participants
         - Match Prize = 50, 100, 500rs, 1000rs
        
        DAY_3

         - Player Join the match with id 1,2,3,4
         - Get all Participants
         - allocate matche based on the order wise, 1-2, 3-4...
         - Admin start to announce the matcb
        
        DAY 4

        - Match Rounds 
        4 participants means - 2 rounds
        8 participants means - 3 rounds
        16 participants means - 4 rounds

        - participants room 
        Start match for each particpants
        - chat room - share screenshot
        - admin decidde Whom to win 
        - the winner is going to next next round 

        DAY 5
        
        - if the round end split the cash to admin gamex and winner

        - TOTAL -100%

        - admin - 20%
        - GamexPlatform - 10%
        - Player Winner - 70%

        DAY 6

        - User MAtch Statitics
        - Withdraw

        -Stripe Payment Gateway

        DAy 7

        DESIGN - FRONT END DEVELOPEMNT _PENDING

        10 days

        OPTIONAL
        PES ACCOUNTS - shows pes account buy and sell accounts




        actually in FED
i will create get partcipant on this match id so admin and every user can see the page show many particpants and user details about them , structe of  fed is like that only

_so when user join the match i ll add specific id 1st who join they ll get id of this match 1,2,3,4
i ll split match 1 and 2 order wise , 3 sould competite with 4
so i ll add button between 1 and 2 
those partcipants can enter only that room - means inside the room chat ui and footbal stats ui goals, user details of them like that, uderstood?
then admin can also enterevery room user won the match user upload image thet i won so admin submit the match user 2 goal 1 the if they not submit within this time period admin can decide who to win who to terminate won person go to next round


Here are the approximate hex codes for the colors from the video:

Deep Blue – #1A237E
Bright Yellow – #FFEB3B
Vibrant Orange – #FF5722
Soft White – #F5F5F5
Emerald Green – #2E7D32