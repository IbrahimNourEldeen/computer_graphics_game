#include <GL/glut.h>

void drowTriangle()
{
    glBegin(GL_TRIANGLES);
    glVertex2f(0.5f, 0.1f);
    glVertex2f(-0.5f, 0.1f);
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
void display()
{
    glClear(GL_COLOR_BUFFER_BIT);
    glLoadIdentity();

    glColor3f(1.0, 1.0, 1.0);
    glPushMatrix();
        drowSquare(2.0f, 2.0f);
    glPopMatrix();
    
    glColor3f(1.0, 0.0, 0.0);
    glPushMatrix();
    glTranslatef(0.0f, -0.3f, 0.0f);
    drowSquare(1.0f, 1.4f);
    glPopMatrix();
    
    glColor3f(0.0, 1.0, 0.0);
    glPushMatrix();
        glTranslatef(0.0f, -0.5f, 0.0f);
        drowSquare(0.3f, 1.0f);
    glPopMatrix();
    
    glColor3f(1.0, 1.0, 1.0);
    glPushMatrix();
    glTranslatef(-0.33f, -0.4f, 0.0f);
    drowSquare(0.15f, 0.5f);
    glPopMatrix();
    
    glPushMatrix();
    glTranslatef(0.33f, -0.4f, 0.0f);
    drowSquare(0.15f, 0.5f);
    glPopMatrix();
    

    glColor3f(0.4, 0.0, 1.0);
    glPushMatrix();
        glTranslatef(0.0f, 0.5f, 0.0f);
        glRotatef(180.0f, 0.0f, 0.0f, 1.0f);
        drowTriangle();
    glPopMatrix();

    
    glFlush();
}

int main(int argc, char **argv)
{
    glutInit(&argc, argv);

    glutInitWindowSize(1000, 500);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowPosition(300, 100);
    glutCreateWindow("first");
    glutDisplayFunc(display);
    glutMainLoop();
    return 0;    
}
