import { readFileSync, writeFileSync, existsSync } from 'fs';
import { Innertube, UniversalCache } from '../bundle/node.cjs';

const creds_path = './my_yt_creds_mixplaylists4198.json';
const creds = existsSync(creds_path) ? JSON.parse(readFileSync(creds_path).toString()) : undefined;

(async () => {
  const yt = await Innertube.create({ cache: new UniversalCache(false) });
  
  yt.session.on('auth-pending', (data: any) => {
    console.info(`Hello!\nOn your phone or computer, go to ${data.verification_url} and enter the code ${data.user_code}`);
  });

  yt.session.on('auth', (data: any) => {
    writeFileSync(creds_path, JSON.stringify(data.credentials));
    console.info('Successfully signed in!');
  });

  yt.session.on('update-credentials', (data: any) => {
    writeFileSync(creds_path, JSON.stringify(data.credentials));
    console.info('Credentials updated!', data);
  });

  await yt.session.signIn(creds);
  let info=await yt.account.getInfo();
  console.info(info);
  const comment_section = await yt.getComments('2h6atA1hbY8');
  console.info(`This video has ${comment_section.header?.comments_count.toString() || 'N/A'} comments.\n`);for (const thread of comment_section.contents) {
    const comment = thread.comment;
    if (comment) {
     const res= await comment.pin();
     console.info(res);
      // const action_menu=comment.action_menu;
      // if(action_menu){
      //   const items=action_menu.items;
      //   for (const item of items){
      //     console.info(item);
      //     var obj=JSON.parse(JSON.stringify(item.key('endpoint').object()));
      //     console.info(obj);
      //   }
      // }
      // comment.pin();
      console.info(
        `${comment.is_pinned ? '[Pinned]' : ''}`,
        `${comment.is_member ? `${comment.sponsor_comment_badge?.tooltip}` : ''}`,
        `${comment.author.name} • ${comment.published}\n`,
        `${comment.content.toString()}`, '\n',
        `Likes: ${comment.vote_count}`, '\n'
      );
	  
	}
  }
  /*const file = readFileSync('./my_awesome_video.mp4');
  
  const upload = await yt.studio.upload(file.buffer, {
    title: 'Wow!',
    description: new Date().toString(),
    privacy: 'UNLISTED'
  });

  console.info('Done!', upload);*/
})();