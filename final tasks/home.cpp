#include <GL/glut.h>
#include <math.h>

float leftDoorScale = 0.0f;  
float rightDoorScale = 0.8f; 
float scaleDirection = 0.005f;

const float DOOR_WIDTH = 0.11f;
const float DOOR_HEIGHT = 0.38f;

void drowTriangle()
{
    glBegin(GL_TRIANGLES);
    glVertex2f(0.356f, 0.0f);
    glVertex2f(-0.35f, 0.0f);
    glVertex2f(0.0f, -0.4f);
    glEnd();
}

void drowSquare(float w, float h)
{
    glBegin(GL_QUADS);
    glVertex2f(w / 2, h / 2);
    glVertex2f(-w / 2, h / 2);
    glVertex2f(-w / 2, -h / 2);
    glVertex2f(w / 2, -h / 2);
    glEnd();
}

void designWindow()
{
    glColor4f(1.0, 1.0, 1.0, 0.2);
    glPushMatrix();
    drowSquare(2.0f, 2.0f);
    glPopMatrix();

    glColor3f(0.45f, 0.25f, 0.10f);

    glPushMatrix();
    glTranslatef(-0.5f, 0.5f, 0.0f);
    drowSquare(0.9f, 0.9f);
    glPopMatrix();

    glPushMatrix();
    glTranslatef(0.5f, 0.5f, 0.0f);
    drowSquare(0.9f, 0.9f);
    glPopMatrix();

    glPushMatrix();
    glTranslatef(-0.5f, -0.5f, 0.0f);
    drowSquare(0.9f, 0.9f);
    glPopMatrix();

    glPushMatrix();
    glTranslatef(0.5f, -0.5f, 0.0f);
    drowSquare(0.9f, 0.9f);
    glPopMatrix();
}

void designDoor()
{
    glColor3f(0.45f, 0.25f, 0.10f);
    
    glPushMatrix();
    glTranslatef(-0.11f, -0.6f, 0.0f); 
    
    glScalef(leftDoorScale, 1.0f, 1.0f);
    
    glTranslatef(DOOR_WIDTH / 2, DOOR_HEIGHT / 2, 0.0f);
    drowSquare(DOOR_WIDTH, DOOR_HEIGHT);
    glPopMatrix();
    ///
    glPushMatrix();
    glTranslatef(0.11f, -0.6f, 0.0f);
    
    glScalef(rightDoorScale, 1.0f, 1.0f);
    
    glTranslatef(-DOOR_WIDTH / 2, DOOR_HEIGHT / 2, 0.0f); 
    drowSquare(DOOR_WIDTH, DOOR_HEIGHT);
    glPopMatrix();
}

void updateAnimation(int value)
{
    leftDoorScale += scaleDirection;
    rightDoorScale += scaleDirection;
    
    if (leftDoorScale >= 1.0f)  
    {
        leftDoorScale = 1.0f;
        rightDoorScale = 1.0f;
        scaleDirection = -0.005f;
    }
    else if (leftDoorScale <= 0.2f) 
    {
        leftDoorScale = 0.2f;
        rightDoorScale = 0.2f;
        scaleDirection = 0.005f; 
    }
    
    glutPostRedisplay();
    
    glutTimerFunc(30, updateAnimation, 0);
}

void display()
{
    glClear(GL_COLOR_BUFFER_BIT);
    glLoadIdentity();

    glColor3f(0.5, 0.1, 1.0);
    glPushMatrix();
    drowSquare(2.0f, 2.0f);
    glPopMatrix();

    glColor3f(1.0, 0.9, 0.8);
    glPushMatrix();
    glTranslatef(0.0f, -0.1f, 0.0f);
    drowSquare(0.7f, 1.0f);
    glPopMatrix();

    glColor3f(0.45f, 0.25f, 0.10f);
    glPushMatrix();
    glTranslatef(0.0f, 0.4f, 0.0f);
    glRotatef(180.0f, 0.0f, 0.0f, 1.0f);
    drowTriangle();
    glPopMatrix();

    designDoor();

    glPushMatrix();
    glTranslatef(-0.18f, 0.0f, 0.0f);
    glScalef(0.045f, 0.13f, 1.0f);
    designWindow();
    glPopMatrix();

    glPushMatrix();
    glTranslatef(0.18f, 0.0f, 0.0f);
    glScalef(0.045f, 0.13f, 1.0f);
    designWindow();
    glPopMatrix();
    
    glFlush();
}

int main(int argc, char **argv)
{
    glutInit(&argc, argv);
    glutInitWindowSize(1400, 900);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowPosition(300, 100);
    glutCreateWindow("Animated Door - Hinge Effect");
    glutDisplayFunc(display);
    
    glutTimerFunc(30, updateAnimation, 0);
    
    glutMainLoop();
    return 0;
}