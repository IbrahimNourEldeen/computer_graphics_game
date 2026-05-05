#include <GL/glut.h>

float angle = 0.0;
float tx = 0.0, ty = 0.0;
float scale = 1.0;
float shearX = 0.0;

int rotateOn = 0;
int translateOn = 0;
int scaleOn = 0;
int reflectOn = 0;
int shearOn = 0;

void drawStar()
{
    glColor3f(1.0, 0.0, 0.5);

    glBegin(GL_TRIANGLE_FAN);
    glVertex2f(0, 0);
    glVertex2f(0, 50);
    glVertex2f(14, 20);
    glVertex2f(47, 15);
    glVertex2f(23, -7);
    glVertex2f(29, -40);
    glVertex2f(0, -25);
    glVertex2f(-29, -40);
    glVertex2f(-23, -7);
    glVertex2f(-47, 15);
    glVertex2f(-14, 20);
    glVertex2f(0, 50);
    glEnd();
}

void display()
{
    glClear(GL_COLOR_BUFFER_BIT);
    glLoadIdentity();
    glTranslatef(tx, ty, 0);
    glRotatef(angle, 0, 0, 1);
    glScalef(scale, scale, 1);
    //x new = x +(shear(x) * y)
    GLfloat shearMatrix[16] = {
        1, shearX, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1};
    glMultMatrixf(shearMatrix);
    drawStar();
    glFlush();
}

void update(int value)
{
    if (rotateOn) angle += 0.3; 
    if (translateOn) tx += 0.3; 
    if (scaleOn)scale += 0.005; 
    // if (reflectOn) scale = -scale;
    if (shearOn) shearX += 0.01; 

    glutPostRedisplay();
    glutTimerFunc(30, update, 0);
}

void keyboard(unsigned char key, int x, int y)
{
    if (key == 'r') rotateOn = !rotateOn;
    if (key == 't') translateOn = !translateOn;
    if (key == 's') scaleOn = !scaleOn;
    // if (key == 'f') reflectOn = !reflectOn;
    if (key == 'f') {
        scale = -scale;
    };
    if (key == 'h') shearOn = !shearOn;
    if (key == 'b') {
        rotateOn = translateOn = scaleOn = reflectOn = shearOn = 0;
        angle = 0.0;
        tx = ty = 0.0;
        scale = 1.0;
        shearX = 0.0;
    };
}

int main(int argc, char **argv)
{
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowSize(800, 800);
    glutInitWindowPosition(600, 100);
    glutCreateWindow("Star Shape");
    glClearColor(1.0, 1.0, 1.0, 1.0);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluOrtho2D(-100.0, 100.0, -100.0, 100.0);

    glMatrixMode(GL_MODELVIEW);

    glutDisplayFunc(display);
    glutKeyboardFunc(keyboard);
    glutTimerFunc(0, update, 0);
    glutMainLoop();

    return 0;
}