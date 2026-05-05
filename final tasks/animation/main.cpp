#include<Windows.h> // get screen size
#include<math.h>
#include<GL\glut.h>


bool fullScreen = true , stop;

bool keyStates[256];
int c1 = 0 , qc = 1;
float width ,height , sWidth , sHeight
	, r = 2 , cx , cy , delcx = .3 , delcy = .3
	, xq,yq , delqx = .3 , delqy = .3,
	 PI = 22/7.0;

void draw();
void reshape(int,int);
void backGround();
void timer(int);

// [$$$$$$$$$$$$$$$$$$$$$$$$$$$$$]
// any key has ASCII code written here [ keyboarddown() , keyboardup()]
// when you press on button this function run
void keyboarddown(unsigned char  , int , int);
// when you release a button this function run
void keyboardup(unsigned char  , int , int);

// any key do not have ASCII code written here [ keySpecialdown() , keySpecialup()]
// when you press on button this function run
void keySpecialdown(int,int,int);
// when you release a button this function run
void keySpecialup(int,int,int);

// for mouse events
void mouse (int , int , int , int);
void mostion(int ,int );
// [$$$$$$$$$$$$$$$$$$$$$$$$$$$$$]


int main( int argc , char ** argv){
	// glut init
	glutInit(&argc , argv);
	glutInitDisplayMode(GLUT_RGB | GLUT_DOUBLE);
	// end of glut init
	// create window
	
	// [$$$$$$$$$$$$$$$$$$$$$$$$$$$$$]
	width = GetSystemMetrics(SM_CXSCREEN);
	height = GetSystemMetrics(SM_CYSCREEN);
	// [$$$$$$$$$$$$$$$$$$$$$$$$$$$$$]
	
	//glutInitWindowSize(width,height);
	//glutInitWindowPosition(10,10);
	glutCreateWindow("keyboard events");
	glutFullScreen();
	// end create window
	// call back functions
	glutDisplayFunc(draw);
	glutReshapeFunc(reshape);
	glutTimerFunc(0,timer,0);
	
	// [$$$$$$$$$$$$$$$$$$$$$$$$$$$$$]
	glutKeyboardFunc(keyboarddown);
	glutKeyboardUpFunc(keyboardup);
	glutSpecialFunc(keySpecialdown);
	glutSpecialUpFunc(keySpecialup);
	glutMouseFunc(mouse);

	// [$$$$$$$$$$$$$$$$$$$$$$$$$$$$$]
	
	
	backGround();
	// end call back functions
	// main loop
	glutMainLoop();
}
void reshape(int w ,int h ){
	float ratio;
	if( h == 0 )
		h = 1;
	ratio = (float)w / h ;
	glViewport(0,0,w,h);
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	if( w >= h ){
		gluOrtho2D(-10*ratio,10*ratio,-10,10);
		sWidth = 10*ratio ;
		sHeight = 10;
	}
	else{
		gluOrtho2D(-10,10,-10/ratio,10/ratio);
		sWidth = 10 ;
		sHeight = 10/ratio;
	}
	glMatrixMode(GL_MODELVIEW);
}
void backGround(){
	// color [0,1]
	glClearColor(.5,.4,1,0);
}

void timer(int v){
	// repaint
	glutPostRedisplay();
	glutTimerFunc(40,timer,0);
	cx = delcx;
	cy = delcy;
	// 	cx += delcx;
	// 	cy += delcy;
	//if (!stop) {
	xq += delqx  ;
	if( xq > sWidth-2 || xq < -sWidth)
		delqx = -delqx;
	yq += delqy; 
	if( yq > sHeight-2 || yq < -sHeight)
		delqy = -delqy;
// }
}


void draw(){
	glClear(GL_COLOR_BUFFER_BIT);
	glLoadIdentity();
	
	// [$$$$$$$$$$$$$$$$$$$$$$$$$$$$$]
	// draw circle empty
//	glLineWidth(3);
//	glColor3f(c1,0,0);
//	glBegin(GL_LINE_STRIP);
//	for(float i = 0 ; i <= 2*PI ; i += PI/500)
//		glVertex2f(cx+cos(i)*r , cy+sin(i)*r);
//	glEnd();
	
	// [$$$$$$$$$$$$$$$$$$$$$$$$$$$$$]
	// draw cirle filled
	glBegin(GL_TRIANGLE_FAN);
	glColor3f(c1,0,0);
	glVertex2f(cx , cy);
	for(float i = 0 ; i <= 2*PI ; i += PI/500)
		glVertex2f(cx+cos(i)*r , cy+sin(i)*r);
	glEnd();
//	
	// [$$$$$$$$$$$$$$$$$$$$$$$$$$$$$]
	// draw squar
	glColor3f(0,qc,0);
	glBegin(GL_QUADS);
	glVertex2f(xq,yq);
	glVertex2f(xq+2,yq);
	glVertex2f(xq+2,yq+2);
	glVertex2f(xq,yq+2);
	glEnd();
	
	
	glutSwapBuffers();
}


// when you press a button this function run
// keyboarddown ( key button , position x, position y)
void keyboarddown(unsigned char key , int x , int y ){
	keyStates[key] = true;
	
	// if you press 2 keys move slanting [/]
	if(keyStates['a'] && keyStates['w']){
			delcy += .3;
			delcx -= .3;
	}
	else if(keyStates['a'] && keyStates['s']){
			delcy -= .3;
			delcx -= .3;
	}
	else if(keyStates['d'] && keyStates['w']){
			delcy += .3;
			delcx += .3;
	}
	else if(keyStates['d'] && keyStates['s']){
			delcy -= .3;
			delcx += .3;
	}
	// if you press 1 keys move vertical [|] or horizontal [-]
	else if ( key == 'a' || key == 'A') // horizontal [-]
		delcx -= .3;
	else if ( key == 'd' || key == 'D') // horizontal [-]
		delcx += .3;
	else if ( key == 'w' || key == 'W') // vertical [|]
		delcy += .3;
	else if ( key == 's' || key == 'S') // vertical [|]
		delcy -= .3;
	else if ( key == 'q' || key == 'Q') // change squar color
		c1 = !c1;
	else if ( key == 'e' || key == 'E') // change circle color
		qc = !qc;
	else if( key == 27) // exit game when press esc 
		exit(0);
	
}

// when you release a button this function run
// keyboardup( key button , position x, position y)
void keyboardup(unsigned char key  , int x , int y ){
	keyStates[key] = false; // convert key status to false
}

// when you press a button this function run
void keySpecialdown(int key ,int x ,int y ){
	keyStates[key] = true;
	if( keyStates[GLUT_KEY_LEFT] &&
		keyStates[GLUT_KEY_UP]){
			delcx -= .3;
			delcy += .3;
	}
	else if( keyStates[GLUT_KEY_LEFT] &&
		keyStates[GLUT_KEY_DOWN]){
			delcx -= .3;
			delcy -= .3;
	}
	if( keyStates[GLUT_KEY_RIGHT] &&
		keyStates[GLUT_KEY_DOWN]){
			delcx += .3;
			delcy -= .3;
	}
	if( keyStates[GLUT_KEY_RIGHT] &&
		keyStates[GLUT_KEY_UP]){
			delcx += .3;
			delcy += .3;
	}
	else if ( key == GLUT_KEY_LEFT)
		delcx -= .3;
	else if ( key == GLUT_KEY_RIGHT)
		delcx += .3;
	else if ( key == GLUT_KEY_UP)
		delcy += .3;
	else if ( key == GLUT_KEY_DOWN)
		delcy -= .3;
	// press F1 to switch from fullScreen
	else if(key == GLUT_KEY_F1){
		fullScreen = !fullScreen;
		if(fullScreen)
			glutFullScreen();
		else{
				// change from full to half size
				glutReshapeWindow(width/2 , height/2);
				// make it on center of screen
				glutPositionWindow(width/4, height/4 );
			}
	}
}

// when you release a button this function run
void keySpecialup(int key,int x ,int y ){
	keyStates[key] = false; // convert keySpecial status to false
}

// mouse events
// keyboardup(  button left or rghit , state up dwon , position x, position y)
void mouse (int button , int state , int x , int y){
	
	// when press mouse left button && status is DOWN not release
	if( button == GLUT_LEFT_BUTTON && state == GLUT_DOWN){

		qc = !qc; // change suar color
		stop = !stop; // flag to reverse move of squar
		// if(!stop){
		// 	delqx = .3;
		// 	delqy = .3;
			
		// }
		// else{
		// 	delqx = 0;
		// 	delqy = 0;
		// 	// each time move right why? +
		// }
	}

}
