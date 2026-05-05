#include <GL/glut.h>
#include <math.h>

float houseX = 0.0f;      
float houseY = 0.0f; 
float speedX = 0.01f;  
float speedY = 0.006f;   

const float HOUSE_BODY_WIDTH = 0.7f;  
const float HOUSE_BODY_HEIGHT = 1.0f;  
const float ROOF_HEIGHT = 0.4f;       
const float TOTAL_HOUSE_HEIGHT = HOUSE_BODY_HEIGHT + ROOF_HEIGHT;

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
    glTranslatef(0.0f, -0.32f, 0.0f);
    drowSquare(0.22f, 0.38f);
    glPopMatrix();
    
    glColor3f(0.8f, 0.7f, 0.2f);
    glPushMatrix();
    glTranslatef(-0.07f, -0.25f, 0.0f);
    glBegin(GL_POLYGON);
    for(int i = 0; i < 360; i++) {
        float angle = i * 3.14159f / 180.0f;
        glVertex2f(0.02f * cos(angle), 0.02f * sin(angle));
    }
    glEnd();
    glPopMatrix();
}

void getHouseBounds(float x, float y, float &left, float &right, float &bottom, float &top)
{
    left = x - HOUSE_BODY_WIDTH / 2;      
    right = x + HOUSE_BODY_WIDTH / 2;     
    bottom = y - HOUSE_BODY_HEIGHT / 2;   
    top = y + HOUSE_BODY_HEIGHT / 2 + ROOF_HEIGHT; 
}

void updateAnimation(int value)
{
    houseX += speedX;
    houseY += speedY;
    
    float left, right, bottom, top;
    getHouseBounds(houseX, houseY, left, right, bottom, top);
    
    if (right >= 1.0f)  
    {
        houseX = 1.0f - (right - houseX);
        speedX = -speedX; 
    }
    else if (left <= -1.0f) 
    {
        houseX = -1.0f + (houseX - left);
        speedX = -speedX;  
    }
    
    if (top >= 1.0f) 
    {
        houseY = 1.0f - (top - houseY);
        speedY = -speedY; 
    }
    else if (bottom <= -1.0f)
    {
        houseY = -1.0f + (houseY - bottom);
        speedY = -speedY;  
    }
    
    glutPostRedisplay();    
    glutTimerFunc(16, updateAnimation, 0);
}

void display()
{
    glClear(GL_COLOR_BUFFER_BIT);
    glLoadIdentity();

    glColor3f(0.5, 0.1, 1.0);
    glPushMatrix();
    drowSquare(2.0f, 2.0f);
    glPopMatrix();

    glPushMatrix();
    glTranslatef(houseX, houseY, 0.0f);  
    
    glColor3f(1.0, 0.9, 0.8);
    glPushMatrix();
    glTranslatef(0.0f, 0.0f, 0.0f);
    drowSquare(HOUSE_BODY_WIDTH, HOUSE_BODY_HEIGHT);
    glPopMatrix();

    glColor3f(0.45f, 0.25f, 0.10f);
    glPushMatrix();
    glTranslatef(0.0f, HOUSE_BODY_HEIGHT/2.8 + ROOF_HEIGHT/2.8, 0.0f);
    glRotatef(180.0f, 0.0f, 0.0f, 1.0f);
    drowTriangle();
    glPopMatrix();

    designDoor();

    glPushMatrix();
    glTranslatef(-0.18f, 0.1f, 0.0f);
    glScalef(0.045f, 0.13f, 1.0f);
    designWindow();
    glPopMatrix();

    glPushMatrix();
    glTranslatef(0.18f, 0.1f, 0.0f);
    glScalef(0.045f, 0.13f, 1.0f);
    designWindow();
    glPopMatrix();
    
    glPopMatrix();  
    
    
    glFlush();
}

int main(int argc, char **argv)
{
    glutInit(&argc, argv);
    glutInitWindowSize(1400, 900);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowPosition(300, 100);
    glutCreateWindow("Moving House - Perfect Collision Detection");
    glutDisplayFunc(display);
    
    glutTimerFunc(16, updateAnimation, 0);
    
    glutMainLoop();
    return 0;
}